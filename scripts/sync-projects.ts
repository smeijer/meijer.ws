import dotenv from 'dotenv';
import { projects } from '../data/projects';
import * as github from "./api/github";
import * as npm from './api/npm';

import fs from 'fs/promises';

async function main() {
  let result = [];

  for (const project of projects) {
    // todo: add downloads using npm api for packages
    if (!project.repo) continue;

    console.log('Fetching', project.repo);
    const { packages, ...repo } = await github.getRepo(project.repo);

    // if there aren't any public packages, it's about the repo.
    if (!packages.length) {
      result.push({
        ...repo,
        highlight: Boolean(project.highlight),
        tags: project.tags?.sort() || [],
        name: project.name || repo.name,
        description: project.description || repo.description,
      });
    }

    for (let pkg of packages) {
      const stats = await npm.getDownloadCount(pkg.name);
      pkg.highlight = Boolean(project.highlight);
      pkg.tags = pkg.tags?.sort() || [];
      pkg.downloads = stats.downloads;
      result.push(pkg);
    }
  }

  // result.push(...JSON.parse(await fs.readFile('./data/packages.json', 'utf-8')));

  // sort:
  //  first items without `links.npm`,
  //  then by stars
  //  ensure that all names with '@' are at the end
  result = result.sort((a, b) => {
    if (a.highlight && !b.highlight) return -1;
    if (!a.highlight && b.highlight) return 1;
    if (a.name.includes('@') && !b.name.includes('@')) return 1;
    if (!a.name.includes('@') && b.name.includes('@')) return -1;
    if (!a.links?.npm && b.links?.npm) return -1;
    if (a.links?.npm && !b.links?.npm) return 1;
    if (a.stars > b.stars) return -1;
    if (a.stars < b.stars) return 1;
    return 0;
  });

  await fs.writeFile('./data/packages.json', JSON.stringify(result, null, 2));
}

main();
