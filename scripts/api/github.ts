import dotenv from 'dotenv';
const { parsed: env } = dotenv.config({ path: '.env.local' });

function gh(path) {
  return fetch(`https://api.github.com/${path.replace(/^\//, '')}`, {
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${env.GITHUB_TOKEN}`
    },
  }).then(x => x.json());
}

function findPackageJson(folder) {
  return folder.entries.find((entry) => entry.name === 'package.json');
}

function findLogo(folder) {
  const logoNames = ['logo.svg', 'logo.png', 'logo.jpg'];
  const logo = logoNames.map(name => folder.entries.find(x => x.name === name)).filter(Boolean)[0];

  return logo ? {
    name: logo.name,
    content: logo.object.text,
  } : null;
}

export async function getRepo(reponame) {
  // reverse so that it doesn't matter if repo is passed in as owner/name or
  // as full github url
  const [name, owner] = reponame.split('/').reverse();

  const res = await fetch(`https://api.github.com/graphql`, {
    method: 'POST',
    headers: {
      authorization: `bearer ${env.GITHUB_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query repository ($owner: String!, $name: String!) { 
          repository(owner: $owner, name: $name) {
            name
            description
            date: createdAt
            homepage: homepageUrl
            url
            private: isPrivate
            stars: stargazerCount
            
            branch: defaultBranchRef {
              name
            }
            
            topics: repositoryTopics (first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
    
            root: object(expression: "HEAD:") {
              ... on Tree {
                entries {
                  name
                  
                  object {
                    ... on Blob {
                      text
                    }
                  }
                }
              }
            }

            packages: object(expression: "HEAD:packages") {
              ... on Tree {
                entries {
                  name

                  object {
                    ... on Blob {
                     text
                    }
                    
                    ... on Tree {
                      entries {
                        name
                        path
          
                        object {
                          ... on Blob {
                            text
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        owner,
        name,
      },
    }),
  }).catch(err => {
    console.error(err);
    throw err;
  });

  const { data: { repository } } = await res.json();

  const parsePackageJson = (pkg) => {
    if (!pkg?.object?.text) return {};
    const obj = JSON.parse(pkg.object.text);


    const githubLink = repository.private ? null : (
      `https://github.com/${owner}/${name}` +
      (pkg.path ? `/tree/${repository.branch.name}/${pkg.path.replace(/\/package.json$/, '')}` : '')
    );


    const links = {
      homepage: obj.homepage || null,
      github: githubLink,
      npm: obj.private ? null : `https://npmjs.com/${obj.name}`,
    };

    return {
      name: obj.name,
      description: obj.description,
      tags: obj.keywords,
      link: links.homepage || githubLink || links.npm,
      links,
      private: Boolean(obj.private),
      stars: repository.stars,
      date: repository.date.slice(0, 10),
    };
  };

  const githubLink = (!repository.private && repository.url) || null;

  const repo = {
    name: repository.name,
    description: repository.description,
    private: repository.private,
    logo: findLogo(repository.root),
    tags: repository.topics?.nodes.map((x) => x.topic.name) || [],
    link: repository.homepage || githubLink || null,
    links: {
      homepage: repository.homepage || null,
      github: githubLink,
      npm: null,
    },
    stars: repository.stars,
    date: repository.date.slice(0, 10),
  }

  const rootPackage = {
    ...parsePackageJson(findPackageJson(repository.root)),
    logo: findLogo(repository.root),
  };

  const workspacePackages = repository.packages?.entries?.map((pkg) => ({
    ...parsePackageJson(findPackageJson(pkg.object)),
    logo: findLogo(pkg.object),
  })) || [];

  const packages = [rootPackage, ...workspacePackages].filter(x => x.name && x.private !== true);

  if (!packages.length) {
    repo.name = rootPackage.name || repo.name;
  }

  return {
    ...repo,
    packages
  };
}

export async function getRepos(login) {
  const response = await gh(`/users/${login}/repos?per_page=1000`);
  return response.filter(x => !x.fork).map(x => ({
    name: x.name,
    full_name: x.full_name,
    admin: x.permissions.admin,
    fork: x.fork,
    stars: x.stargazers_count,
    visibility: x.visibility,
    topics: x.topics,
    homepage: x.homepage,
  }));
}
