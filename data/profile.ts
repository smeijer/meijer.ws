import clearlyLogo from '@/images/logos/clearly.svg'
import gowionLogo from '@/images/logos/gowion.svg'
import dmAppLogo from '@/images/logos/dm.svg'
import kentcdoddsLogo from '@/images/logos/kentcdodds.png'
import magicBellLogo from '@/images/logos/magicbell.svg'

import image1 from '@/images/photos/image-1.jpg'
import image2 from '@/images/photos/image-2.jpg'
import image3 from '@/images/photos/image-3.jpg'
import image4 from '@/images/photos/image-4.jpg'
import image5 from '@/images/photos/image-5.jpg'
import portraitImage from '@/images/portrait.jpg'
import avatarImage from '@/images/avatar.jpg'

import packages from '@/../data/packages.json';


export const profile = {
  author: {
    name: 'Stephan Meijer',
    pitch: 'Software engineer, creator, and open source maintainer.',
    bio: `Startup Engineer. Perhaps you use some of my [open source](/projects?q=open-source) projects, or [products](/projects?q=product). If so, I'd love to [hear from you](https://go.meijer.ws/twitter)!`,
    // bio: ` a software engineer and open source maintainer based in Leeuwarden, Netherlands. I'm the maker of several open source projects, including testing-playground.com where I help developers improve their testing skills.`,
    email: 'stephan@meijer.ws',
    profilePhoto: portraitImage,
    avatar: avatarImage,
  },
  photos: [
    { src: image1, alt: "" },
    { src: image2, alt: '' },
    { src: image3, alt: '' },
    { src: image4, alt: '' },
    { src: image5, alt: '' },
  ],
  links: {
    twitter: 'https://go.meijer.ws/twitter',
    linkedin: 'https://go.meijer.ws/linkedin',
    github: 'https://go.meijer.ws/github',
    instagram: '',
    email: 'https://go.meijer.ws/email',
  },
  blog: {
    title: 'Writing about code, growth, and world views.',
    intro: 'All of my long-form thoughts on programming, growth, world views and more, collected in chronological order.'
  },
  about: {
    title: 'I’m Stephan Meijer. I live in Leeuwarden, Netherlands, where I code in light mode.',
    description: `
      I've loved writing software since I was a kid. I started writing DOS scripts, then moved on to Visual Basic, PHP, C#.net and JavaScript. I've been working as a software engineer for over 15 years. Made my entry in tech by launching my own SaaS, GoWion, which later served as a foundation for my career. 
      
      I've traded GoWion for a share in an early startup that I joined, which then got rebranded to Clearly. I helped grow the product and the team around it. First with local engineers, later with a remote team in Ukraine, where I met my wife. After working for 7 years at the company, and for 10 years on the same product, it was time to trade my position as CTO for something new.
      
      I've freelanced, helped Kent C. Dodds launch his new website, helped early stage startups with their MVP while they were still in "stealth mode", and I've worked on my own projects.
      
      One of Kent's tweets lead to me joining MagicBell, a YCombinator backed startup. As principal engineer, I'm helping them build the best notification product for SaaS applications, maintain their open-source SDKs, do some customer support, and work on product.
      
      In my free time, I maintain open-source projects like [testing-playground.com](https://testing-playground.com), work on my own SaaS products like rake.red, updrafts.app, and metricmouse.com, and when there's time left, I work on my house using my hands instead of my keyboard.
    `,
  },

  projects: {
    title: 'Things I\'ve made, worth sharing.',
    intro: 'I’ve worked on tons of little projects over the years but these are the ones worth sharing. Many of them are open-source, so if you see something that has your interest, check out the code and contribute if you have ideas for how it can be improved.',
    entries: packages,
  },
  resume: {
    link: '',
    entries: [
    {
      company: 'MagicBell',
      title: 'Principal Engineer',
      logo: magicBellLogo,
      start: '2021',
      end: 'Present',
    },
    {
      company: 'DM.app',
      title: 'Freelance Fullstack',
      logo: dmAppLogo,
      start: '2021',
      end: '2021',
    },
    {
      company: 'Kent C. Dodds',
      title: 'Freelance Frontend',
      logo: kentcdoddsLogo,
      start: '2021',
      end: '2021',
    },
    {
      company: 'Clearly',
      title: 'CTO - Product Owner',
      logo: clearlyLogo,
      start: '2014',
      end: '2021',
    },
    {
      company: 'GoWion',
      title: 'CEO - Founder',
      logo: gowionLogo,
      start: '2011',
      end: '2014',
    },
  ] },
  uses: {
    title: 'Software I use, gadgets I love, and other things I recommend.',
    intro: 'I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I’m being productive when I’m really just procrastinating. Here’s a big list of all of my favorite stuff.',
    entries: [
      {
        group: 'Workstation',
        title: '16” MacBook M1 Pro, 32GB RAM (2021)',
        description: `I've always been a Windows/Linux user, and a loyal Dell customer, but I was done with the fan noise, and the constant throttling to keep the CPU cool. I've been using this MacBook since early 2022, and I'm very happy with it. It's quiet, has an amazing battery, and a large 16" screen. The notch is still weird, and the OS ain't perfect, but as long as Intel isn't fixing its heat issues, the Mac is here to stay.`
      },
      {
        group: "Workstation",
        title: '40" UltraWide Monitor (Dell U4021QW)',
        description: `I've had an LG 38WN95CP for a while, which had better specs on paper, but after 3 RMAs I gave up on it. I'm very happy with this Dell monitor. It's a bit bigger, has a good resolution, and the colors are great. I'm using it in combination with MacBook, which is connected via a single USB-C cable. The monitor charges the laptop, and acts as a USB hub for my keyboard and mouse. I'm using the monitor's built-in speakers, which are surprisingly good.`,
        // link: 'https://www.dell.com/en-us/shop/dell-ultrasharp-40-curved-wuhd-monitor-u4021qw/apd/210-becu/monitors-monitor-accessories',
      },
      {
        group: 'Workstation',
        title: 'Blue Yeti X USB Microphone',
        description: 'I use this for all of my video calls. It’s a great mic and I love the built-in gain meter. I have it mounted on a Blue Compass boom arm, which is a great addition.',
        // link: 'https://www.logitechg.com/products/streaming-gear/yeti-x-professional-microphone.988-000244.html'
      },
      {
        group: 'Workstation',
        title: 'Garmin vívomove® Style',
        description: 'I love this watch. It’s a hybrid smartwatch, which means it looks like a regular watch, but it has a small screen that shows notifications, and tracks my health. It’s a great watch, and I love their Body Battery feature.',
        // link: 'https://www.garmin.com/en-US/p/662825/pn/010-02240-01',
      },
      {
        group: 'Development tools',
        title: 'WebStorm',
        description: 'I’ve been using WebStorm for years, and I love it. It’s a great IDE for JavaScript / TypeScript. It’s fast, has great refactoring tools, and the built-in debugger is amazing.',
      },
      {
        group: 'Development tools',
        title: 'Wallaby.js',
        description: 'Wallaby.js is a test runner that runs your tests as you type. It’s a great tool to get immediate feedback on your code. It’s a paid tool, but it’s worth every penny.',
      },
      {
        group: 'Development tools',
        title: 'Quokka.js',
        description: 'Quokka.js is a great tool to get immediate feedback on your code. It’s a great tool to try out new ideas, or to quickly test a regular expression.',
      },
      {
        group: 'Development tools',
        title: 'Fish shell',
        description: 'I’ve been using Fish shell for a while now, and I love it. It’s fast, has great auto-completion, and it’s easy to configure. I’m using the Starship prompt, which is a great addition.',
      },
      {
        group: 'Development tools',
        title: 'Figma',
        description: 'I use Figma for all of my design work. It’s a great tool, and it’s free for personal use.',
      },
      {
        group: 'Development tools',
        title: 'Typora',
        description: `I use Typora for all of my (markdown) writing. It's by far the best markdown editor available. I don't want to think about formatting when writing, and Typora makes that possible.`,
      },
      {
        group: 'Productivity',
        title: 'Raycast',
        description: 'Raycast is a great tool to quickly access all of your tools. It’s a great alternative to Alfred, and it’s free.',
      },
      {
        group: 'Productivity',
        title: 'Centered.app',
        description: 'Centered.app helps me to stay focused. By breaking my workday in 25 minute blocks, and forcing me to take breaks, I’m able to get more done in less time.',
      },
      {
        group: 'Productivity',
        title: 'Niagara Launcher',
        description: 'Niagara Launcher is an Android launcher that helps me to stay focused. Only a few select apps are listed on the homescreen, and allowed to send notifications. All other apps are hidden in an alphabetical list and their notifications are grouped and released at specific times during the day in the form of summaries.',
      }
    ],
  },
}
