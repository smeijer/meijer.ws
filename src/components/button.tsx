import Link from 'next/link'
import clsx from 'clsx'
import { ReactNode } from "react";
import { isLocalLink } from "@/lib/link";

const variantStyles = {
  primary:
    'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70',
  secondary:
    'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70',
}

const sizeStyles = {
  'small': 'text-sm',
  'base': 'text-base',
}

export function Button({ variant = 'primary', className, href, scroll, size = 'base', ...props }: { variant?: keyof typeof variantStyles, className?: string, href?: string, scroll?: boolean; children?: ReactNode, type?: 'button' | 'submit' | 'reset', size?: 'small' | 'base', rel?: string }) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    sizeStyles[size],
    className,

  )

  return href ? (
    <Link href={href} target={isLocalLink(href) ? '_self' : '_blank'} className={className} scroll={scroll} {...props} />
  ) : (
    <button className={className} {...props} />
  )
}
