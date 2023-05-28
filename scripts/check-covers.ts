import glob from "fast-glob";
import path from "path";

async function main() {
  const slugs = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/pages/articles'),
  }).then(x => x.map(y => y.split(/[\/.]/)[0]));

  const imageNames = await glob(['*.png'], {
    cwd: path.join(process.cwd(), 'public/articles'),
  });

  const uncoveredArticles = slugs.filter((articleFilename) =>
    !imageNames.includes(`${articleFilename}.png`)
  );

  const redundantImages = imageNames.filter((imageName) =>
    !slugs.includes(imageName.replace(/\.png$/, ''))
  );

  if (uncoveredArticles.length > 0) {
    console.log('Uncovered articles:', uncoveredArticles);
  }

  if (redundantImages.length > 0) {
    console.log('Redundant images:', redundantImages);
  }

  if (uncoveredArticles.length > 0 || redundantImages.length > 0) {
    process.exit(1);
  }
}

main();
