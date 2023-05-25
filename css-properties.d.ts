import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties {
    position?: `var(--${string})`;
  }
}
