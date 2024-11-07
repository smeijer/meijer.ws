import { Button } from "@/components/button";
import { BlueSkyIcon } from "@/components/social-icons";
import clsx from "clsx";


export function Share({ url, className }: { url: string, className?: string }) {
  return (
    <div className={clsx(className, "rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40")}>
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BlueSkyIcon className="h-6 w-6 flex-none fill-zinc-900 dark:fill-zinc-100" />
        <span className="ml-3">Liked this article?</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        If you made it to here, please share your thoughts on BlueSky, or leave a comment below.
      </p>
      <div className="mt-6 flex gap-4">
        <Button href={`https://bsky.app/intent/compose?text=${url}`} variant="primary" className="flex-none">
          Share on BlueSky
        </Button>

        <Button href={`https://bsky.app/search?q=${url}`} variant="secondary" className="flex-none">
          Discuss on BlueSky
        </Button>
      </div>
    </div>
  )
}
