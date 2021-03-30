const devto = require('@ssgjs/source-devto');
require('dotenv-safe').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// @ts-ignore
const plugin = devto({
  apiKey: process.env.DEV_TO_API_KEY
})

const removeEmpty = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'undefined') {
      newObj[key] = null;
    }
    else if (obj[key] === Object(obj[key])) {
      newObj[key] = removeEmpty(obj[key]);
    }
    else {
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
  }
}

const entities = {
  'amp': '&',
  'apos': '\'',
  '#x27': '\'',
  '#x2F': '/',
  '#39': '\'',
  '#47': '/',
  'lt': '<',
  'gt': '>',
  'nbsp': ' ',
  'quot': '"'
}

function decodeHTMLEntities (text) {
  return text.replace(/&([^;]+);/gm, function (match, entity) {
    return entities[entity] || match
  })
}

function tagFilter(tag) {
  return !['development', 'updraftsapp', 'makers'].includes(tag);
}

async function getReleases(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases`);
  return res.json();
}

async function getNpmData(packageName) {
  const res = await fetch(`https://registry.npmjs.org/${packageName}`);
  return res.json();
}

const projects = require('../data/projects');

async function main() {
  const articles = await devTo.createIndex();

  let out = [...projects];

  for (let article of articles) {
    out.push({
      type: 'article',
      url: article.url,
      image: article.metadata.cover_image,
      slug: article.slug,
      title: article.title,
      description: article.description,
      canonical: article.canonical_url,
      published: article.published_at,
      tags: Object.values(article.tag_list).filter(tagFilter),
    });
  }

  const packages = projects.filter(prj => prj.packages).map(prj => prj.packages.map(pkg => ({
    project: prj,
    name: pkg.name || pkg,
    package: pkg,
  }))).flat();

  for (const pkg of packages) {
    const data = await getNpmData(pkg.name);

    for (let [version, date] of Object.entries(data.time)) {
      if(version === 'created' || version === 'modified') continue;

      const description = data.description.replace(/<!--.*-->/g, '').replace(/(\[(.*)]\(.*\))/g, '$2').trim();

      out.push({
        type: 'release',
        url: `https://npmjs.com/${pkg.name}`,
        title: data.name,
        project: pkg.project.name,
        description: description || pkg.project.description,
        version: version,
        published: date,
      })
    }
  }

  out.sort((a, b) => new Date(a.published).getTime() - new Date(b.published).getTime());

  // github
  // for (let repo of repos) {
  //   const releases = await getReleases(repo);
  //   for (let release of releases) {
  //     if (release.name.includes('-')) {
  //       continue;
  //     }
  //
  //     out.push({
  //       type: 'release',
  //       url: release.url,
  //       slug: repo.split('/')[1] + '/' + release.name,
  //       icon: '/logos/release.svg',
  //       description: release.body,
  //       version: release.name,
  //       published: release.created_at, // published_at is push date, not commit date
  //     });
  //   }
  // }

  fs.writeFileSync(path.join(__dirname , '../data/data.json'), JSON.stringify(out, null, 2), {
    encoding: 'utf-8'
  });
}

main();