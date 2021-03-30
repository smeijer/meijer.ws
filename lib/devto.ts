import devto from '@ssgjs/source-devto';

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

  async getPage(uuid: string) {
    const data = await plugin.getDataSlice(uuid);
    return removeEmpty(data);
  }
}

export default devTo;