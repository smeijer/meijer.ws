const devto = require('@ssgjs/source-devto');
require('dotenv-safe').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function getRepo(repo) {
  // reverse so that it doesn't matter if repo is passed in as owner/name or
  // as full github url
  const [name, owner] = repo.split('/').reverse();

  const res = await fetch(`https://api.github.com/graphql`, {
    method: 'POST',
    headers: {
      authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query repository ($owner: String!, $name: String!) { 
          repository(owner: $owner, name: $name) {
            title: name
            description
            date: createdAt
            url: homepageUrl
            private: isPrivate
            
            branch: defaultBranchRef {
              name
            }
            
            tags: repositoryTopics (first: 10) {
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
  });

  const { data } = await res.json();
  const { root, branch, packages, tags, ...repository } = data.repository;

  const parsePackageJson = (pkg) => {
    const obj = JSON.parse(pkg.object.text);

    const url =
      `https://github.com/${owner}/${name}` +
      (pkg.path
        ? `/tree/${branch.name}/${pkg.path.replace(/\/package.json$/, '')}`
        : '');

    return {
      name: obj.name,
      description: obj.description,
      tags: obj.keywords,
      url: url,
      private: Boolean(obj.private),
    };
  };

  return {
    ...repository,
    tags: tags.nodes.map((x) => x.topic.name),
    package: parsePackageJson(
      root.entries.find((entry) => entry.name === 'package.json'),
    ),
    packages: packages
      ? packages.entries
          .flatMap((pkg) =>
            pkg.object.entries.filter((entry) => entry.name === 'package.json'),
          )
          .map((pkg) => parsePackageJson(pkg))
      : [],
  };
}

async function getRepos(repos) {
  const repositories = [];

  for (const repo of repos) {
    const repository = await getRepo(repo);
    repositories.push(repository);
  }

  return repositories;
}

module.exports = { getRepo, getRepos };
