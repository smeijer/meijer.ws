import { useEffect } from "react";
import { getColorScheme } from "@/lib/dark-mode";

export function changeGiscusTheme(scheme: 'light' | 'dark') {
  const theme =  new URL(`giscus-${scheme}.css`, process.env.NEXT_PUBLIC_SITE_URL).toString();

  const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe.giscus-frame');
  iframes.forEach((iframe) => {
    iframe.contentWindow.postMessage({
      giscus: {
        setConfig: {
          theme,
        }
      }
    }, 'https://giscus.app')
  });
}

export function ArticleComments ({ repo, repoId, category, categoryId }) {
  // this is loaded from the giscus.app domain, we need a full url
  const scheme = getColorScheme();
  const theme = new URL(`giscus-${scheme}.css`, process.env.NEXT_PUBLIC_SITE_URL).toString();

  useEffect(() => {
    const script = document.createElement('script');
    const commentsDiv = document.getElementById('post-comments');
    script.async = true;
    script.setAttribute('src', 'https://giscus.app/client.js');
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    try {
      commentsDiv.appendChild(script);
    } catch (error) {
      console.error('Error while rendering giscus widget.', error);
    }
  }, [repo, repoId, category, categoryId, theme]);

  return (
    <div id="post-comments" className="mt-20">
    </div>
  );
}
