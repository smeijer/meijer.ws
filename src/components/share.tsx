import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/button";
import { TwitterIcon} from "@/components/social-icons";
import clsx from "clsx";

function MailIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

export function Share({ url, className }: { url: string, className?: string }) {
  return (
    <div className={clsx(className, "rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40")}>
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <TwitterIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Liked this article?</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        If you made it to here, please share your thoughts on Twitter!
      </p>
      <div className="mt-6 flex gap-4">
        <Button href={`https://twitter.com/intent/tweet?url=${url}`} variant="primary" className="flex-none">
          Share on Twitter
        </Button>

        <Button href={`https://twitter.com/search?q=${url}`} variant="secondary" className="flex-none">
          Discuss on Twitter
        </Button>
      </div>
    </div>
  )
}
