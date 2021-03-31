import { absoluteUrl } from '~/lib/absolute-url';
import navigateAway from '~/lib/navigate-away';

function SocialButton({ href, icon }) {
  const url = absoluteUrl(href);

  const openUrl = (event) => {
    event.preventDefault();

    if (event.ctrlKey) {
      window.open(url);
    } else {
      navigateAway(() => {
        document.body.dataset.target = new URL(url).hostname;
        window.location.href = url;
      });
    }

    return false;
  };

  return (
    <a
      className="opacity-100 hover:opacity-75 transition"
      href={url}
      onClick={openUrl}
    >
      <img className="w-6 h-6" src={icon} />
    </a>
  );
}

export default SocialButton;
