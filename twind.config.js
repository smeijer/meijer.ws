import { orange, lightBlue } from 'twind/colors';

import typography from '@twind/typography';
import { aspectRatio } from '@twind/aspect-ratio';

/** @type {import('twind').Configuration} */
export default {
  mode: 'silent', // process.env.NODE_ENV === 'production' ? 'silent' : 'warn',
  plugins: {
    ...typography({
      className: 'prose',
    }),
    aspect: aspectRatio,
  },
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        standalone: { raw: '(display-mode:standalone)' },
      },
      colors: {
        orange,
        blue: lightBlue,
      }
    },
  },
}