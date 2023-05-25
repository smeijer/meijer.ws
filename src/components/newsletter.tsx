import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/button";
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

export function Newsletter({ className }: { className?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    setSubmitting(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = formData.get('name');
    const email = formData.get('email');

    await fetch('https://rake.red/api/smeijer/maillist', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
      }),
    }).then((response) => {
      router.push('/thank-you');
    }).catch(() => {
      setSubmitting(false);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(className, "rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40")}
    >
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Stay up to date</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Get notified when I publish something new, and unsubscribe at any time.
      </p>
      <div className="mt-6 flex">
        <input type="text" name="name" placeholder="name" className="hp" />
        <input
          type="email"
          placeholder="Email address"
          aria-label="Email address"
          name="email"
          required
          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
        />
        <Button type="submit" className="ml-4 flex-none">
          Join
        </Button>
      </div>
    </form>
  )
}
