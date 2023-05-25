export function getDownloadCount(pkg: string, { from = '1900-01-01', till = '2100-01-31' } = {}) {
  return fetch(`https://api.npmjs.org/downloads/point/${from}:${till}/${pkg}`).then(x => x.json());
}
