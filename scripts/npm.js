require('dotenv-safe').config();
const fetch = require('node-fetch');

async function getPackage(name) {
  const res = await fetch(`https://registry.npmjs.org/${name}`);
  return res.json();
}

module.exports = { getPackage };
