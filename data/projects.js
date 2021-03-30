const projects = [
  {
    type: 'webapp',
    url: 'https://rake.red',
    image: '/img/projects/rakered.png',
    icon: '/logos/rakered/logo-48.svg',
    title: 'rake.red',
    description:
      'Collect info from users without a server or back-end code. Receive submissions in rake.red. Easy, fast and secure.',
    tags: ['founder', 'saas', 'node.js', 'graphql'],
    published: '2021-01-26',
  }, {
    type: 'library',
    url: 'https://github.com/rakered/rakered',
    image: '/img/projects/rakered.png',
    icon: '/logos/rakered/logo-48.svg',
    title: 'rake.red — open',
    description:
      'The open source components from rake.red',
    tags: ['mongodb', 'accounts', 'node.js', 'email'],
    published: '2021-01-26',
    repo: 'rakered/rakered',
    packages: ['@rakered/accounts', '@rakered/email', '@rakered/errors', '@rakered/forms', '@rakered/hash', '@rakered/mongo'],
  },  {
    type: 'webapp',
    url: 'https://updrafts.app',
    image: '/img/projects/updrafts.png',
    icon: '/logos/updrafts.app/logo-48.svg',
    title: 'Updrafts.app',
    description:
    'Build responsive websites in your browser, without writing code.',
    tags: ['founder', 'saas', 'node.js', 'graphql'],
    published: '2020-09-05', // 2020-09-10 from tailwind-studio.com to updrafts.app
  },
  {
    type: 'webapp',
    url: 'https://issupported.com/',
    image: '/img/projects/issupported.png',
    icon: '/logos/issupported/logo-48.svg',

    title: 'IsSupported',
    description:
    'Check if your browser is still supported by your favorite websites.',
    tags: ['founder', 'webapp', 'node.js', 'serverless'],
    published: '2020-08-27',
  },
  {
    type: 'webapp',
    url: 'https://testing-playground.com',
    image: '/img/projects/testing-playground.jpg',
    icon: '/logos/testing-playground/logo-48.svg',
    title: 'Testing-Playground',
    description:
    'Simple and complete DOM testing playground that encourage good testing practices.',
    tags: ['founder', 'webapp', 'testing', 'a11y'],
    published: '2020-05-18',
    repo: 'smeijer/testing-playground',
  },
  {
    type: 'webapp',
    url: 'https://futureinsight.nl/clearly',
    image: '/img/projects/clearly.png',
    icon: '/logos/clearly/logo-48.svg',
    title: 'Clearly',
    description:
    'A business-to-business collaboration platform for projects in the living environment.',
    tags: ['founder', 'saas', 'node.js', 'graphql'],
    published: '2014-09-17' // 2018-05-09 from dpt-dashboard.com to clearly.app
  },
  {
    type: 'webapp',
    image: '/img/projects/gowion.png',
    title: 'GoWion',
    icon: '/logos/gowion/logo-48.svg',

    published: '2011-09-17',
    description:
    'A pipeline management system for owners and maintainers of underground infrastructures.',
    tags: ['founder', 'saas', 'csharp', 'rest'],
  },
  {
    type: 'library',
    url: 'https://github.com/smeijer/leaflet-geosearch',
    image: '/img/projects/leaflet-geosearch.png',
    icon: '/logos/leaflet-geosearch/logo-48.svg',
    title: 'Leaflet-GeoSearch',
    description:
    'A geocoding/address-lookup library supporting various api providers.',
    tags: ['leaflet.js', 'geosearch'],
    published: '2012-12-04', // https://github.com/smeijer/leaflet-geosearch/commit/dac77d5a7e471ec963f570753877bc6e7de60bb6
    repo: 'smeijer/leaflet-geosearch',
    packages: ['leaflet-geosearch'],
  },
  {
    type: 'library',
    url: 'https://github.com/smeijer/unimported',
    image: '/img/projects/unimported.png',
    title: 'unimported',
    description:
    'A CLI utility that scans node/javascript projects to report dangling files and unused dependencies.',
    tags: ['cli', 'node.js', 'npm'],
    published: '2020-04-26',
    repo: 'smeijer/unimported',
    packages: ['unimported'],
  },
  {
    type: 'library',
    url: 'https://github.com/smeijer/where-broke',
    image: '/img/projects/where-broke.png',
    title: 'where-broke',
    description:
    'A CLI utility that helps finding breaking module versions using binary search and automated tests.',
    tags: ['cli', 'node.js', 'tests'],
    published: '2020-07-03',
    repo: 'smeijer/where-broke',
    packages: ['where-broke'],
  },
  {
    type: 'library',
    url: 'https://github.com/smeijer/graphql-args',
    image: '/img/projects/graphql-args.png',
    title: 'graphql-args',
    description:
    'A lib that parses the resolver ast, to return the requested object fields and provided params, at any nested level.',
    tags: ['node.js', 'graphql', 'mongodb'],
    published: '2020-09-29',
    repo: 'smeijer/graphql-args',
    packages: ['graphql-args'],
  },
  {
    type: 'library',
    url: 'https://github.com/smeijer/jest-partial',
    image: '/img/projects/jest-partial.png',
    title: 'jest-partial',
    description:
    'A partial matcher for Jest to simplify validation of complex structures.',
    tags: ['node.js', 'jest', 'tests'],
    published: '2020-09-28',
    repo: 'smeijer/jest-partial',
    packages: ['jest-partial'],
  },
];

module.exports = projects;