import navigateAway from '~/lib/navigate-away';

const intl = Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

function FeedEntry({ item, isLast, small = false }) {
  const openUrl = (event) => {
    if (!item.url) {
      return;
    }

    event.preventDefault();

    if (event.ctrlKey) {
      window.open(item.url);
    } else {
      navigateAway(() => {
        document.body.dataset.target = new URL(item.url).hostname;
        window.location.href = item.url;
      });
    }

    return false;
  };

  return (
    <li className="hover:bg-blue-900 p-4 transition">
      <div className="relative">
        {!isLast ? (
          <span
            className="absolute top-12 -bottom-6 left-5 -ml-px w-0.5 bg-gray-100 dark:bg-gray-700"
            aria-hidden="true"
          />
        ) : null}

        <div className="flex items-start space-x-3">
          {small ? (
            <div className="px-1">
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                <img
                  className="h-5 w-5 rounded-full flex items-center justify-center"
                  src={item.icon}
                  alt=""
                />
              </div>
            </div>
          ) : (
            <img
              className="h-10 w-10 rounded-full flex items-center justify-center"
              src={item.icon}
              alt=""
            />
          )}

          <div className="min-w-0 flex-1 space-y-0.5">
            <a
              href={item.url}
              onClick={openUrl}
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              <div className="absolute inset-0" />
              <span>{item.title}</span>
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {intl.format(new Date(item.published))}
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default FeedEntry;
