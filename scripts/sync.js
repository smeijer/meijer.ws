const devto = require('@ssgjs/source-devto');
require('dotenv-safe').config();
const fs = require('fs');
const path = require('path');
const github = require('./github');
const npm = require('./npm');
const projectData = require('../data/projects');

// @ts-ignore
const plugin = devto({
  apiKey: process.env.DEV_TO_API_KEY,
});

const entities = {
  amp: '&',
  apos: "'",
  '#x27': "'",
  '#x2F': '/',
  '#39': "'",
  '#47': '/',
  lt: '<',
  gt: '>',
  nbsp: ' ',
  quot: '"',
};

function decodeHTMLEntities(text) {
  return text.replace(/&([^;]+);/gm, function (match, entity) {
    return entities[entity] || match;
  });
}

const removeEmpty = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'undefined') {
      newObj[key] = null;
    } else if (obj[key] === Object(obj[key])) {
      newObj[key] = removeEmpty(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

const devTo = {
  async createIndex() {
    const data = await plugin.createIndex();

    return Object.values(removeEmpty(data));
  },

  async getPage(uuid) {
    const data = await plugin.getDataSlice(uuid);
    return removeEmpty(data);
  },
};

function tagFilter(tag) {
  return !['development', 'updraftsapp', 'makers'].includes(tag);
}

async function main() {
  const articles = (await devTo.createIndex()).map((article) => ({
    type: 'article',
    url: article.url,
    image: article.metadata.cover_image,
    // strip dev.to id from slug
    slug: article.slug.substr(0, article.slug.lastIndexOf('-')),
    title: decodeHTMLEntities(article.title),
    description: article.description,
    canonical: article.canonical_url,
    date: article.published_at,
    tags: Object.values(article.tag_list).filter(tagFilter),
  }));

  //
  // COLLECT PROJECT DATA
  //
  const repos = projectData.filter(
    (prj) => prj.repo || prj.url?.startsWith('https://github.com'),
  );

  for (const repo of repos) {
    const details = await github.getRepo(repo.repo || repo.url);

    // mutate repo, but also use those values to overrule details
    Object.assign(repo, details, { ...repo });
  }

  //
  // COLLECT PROJECTS
  //
  const projects = projectData
    .filter((x) => x.highlight)
    .map((x) => ({ ...x }));

  //
  // SEPARATE OPEN SOURCE
  //
  const opensource = [];

  console.log('fetch details from github');
  for (const repo of repos) {
    if (repo.packages.length > 0) {
      // add all public packages in a mono repo
      for (const package of repo.packages) {
        if (!package.private) {
          opensource.push({
            type: 'library',
            title: package.name || repo.title,
            description: repo.description,
            url: package.url || repo.url,
            github: package.url || repo.url,
            npm: `https://npmjs.com/${package.name}`,
            ...package,
          });
        }
      }
    } else if (repo.package) {
      // if we're dealing with a single package, add it
      if (!repo.package.private) {
        opensource.push({
          type: 'library',
          title: repo.package.name || repo.title,
          description: repo.description,
          github: repo.package.url || repo.url,
          npm: `https://npmjs.com/${repo.package.name}`,
          ...repo.package,
        });
      }
      // otherwise, add the repo itself
      else if (!repo.private) {
        const { package, packages, ...data } = repo;
        opensource.push({
          type: 'webapp',
          ...data,
          url: package.url,
          github: package.url,
        });
      }
    }
  }

  const withoutDate = opensource.filter((x) => x.type === 'library' && !x.date);

  console.log('fetch details from npm');
  for (const package of withoutDate) {
    const details = await npm.getPackage(package.name);
    package.date = details.time.created;
  }

  const sortByDate = (a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime();

  const out = {
    articles: [...articles].sort(sortByDate),
    projects: [...projects].sort(sortByDate),
    'open-source': [...opensource].sort(sortByDate),
  };

  console.log('update generated/data.json');
  fs.writeFileSync(
    path.join(__dirname, '../generated/data.json'),
    JSON.stringify(out, null, 2),
    {
      encoding: 'utf-8',
    },
  );
}

main();
