import { useEffect } from "react";

export function ArticleComments ({ repo, repoId, category, categoryId }) {
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
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    try {
      commentsDiv.appendChild(script);
    } catch (error) {
      console.error('Error while rendering giscus widget.', error);
    }
  }, []);

  return (
    <div id="post-comments" className="mt-20">
    </div>
  );
}
