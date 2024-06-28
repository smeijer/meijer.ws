import type { MDXComponents } from 'mdx/types'
import cn from 'clsx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: (props) => {
      if (typeof props.children === 'string' && props.children.includes('://example.com')) {
        return <span {...props} />
      }

      return <a {...props} />
    },

    table: (props) => {
      return (
        <div><table {...props} /></div>
      );
    },


    td: (props) => {
      if (typeof props.children === 'string' && props.children === 'null') {
        return <td className={cn(props.align, "text-base text-zinc-400 dark:text-zinc-500 italic")}>&lt;null&gt;</td>
      }

      return <td {...props} />
    }
  }
}
