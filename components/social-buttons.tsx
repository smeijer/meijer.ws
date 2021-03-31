import SocialButton from '~/components/social-button';

function SocialButtons() {
  return (
    <div className="flex space-x-4">
      <SocialButton href="/twitter" icon="/logos/twitter.svg" />
      <SocialButton href="/github" icon="/logos/github.svg" />
      <SocialButton href="/linkedin" icon="/logos/linkedin.svg" />
    </div>
  );
}

export default SocialButtons;
