import fs from 'fs/promises';

async function main() {
  const projects = JSON.parse(await fs.readFile('./data/packages.json', 'utf-8'));

  for (const project of projects) {
    project.logo = project.logo?.name || null;
    project.tags = project.tags?.join(', ');

    delete project.description;
    project.link = new URL(project.link).host;
    project.links = Object.entries(project.links).filter(([key, value]) => value).map(([key]) => key);
  }

  console.table(projects);

  const uniqueKeywords = Array.from(new Set(projects.flatMap((x) => x.tags?.split(', ')))).sort()
  console.log('all keywords:', uniqueKeywords.join(', '));
}


main();
