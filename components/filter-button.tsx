import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

function FilterButton({ children, img, slug }) {
  const { query } = useRouter();
  const page = Array.isArray(query.page) ? query.page[0] : query.page;

  let className =
    'cursor-pointer flex focus:outline-none transition py-2 px-4 items-center justify-center whitespace-nowrap relative';

  if (slug === page) {
    className += ' border-b border-blue-400 hover:border-blue-400';
  } else {
    className +=
      ' border-b border-gray-600 hover:border-blue-400 hover:opacity-80';
  }

  return (
    <Link href={`/${slug}`} shallow>
      <motion.a className={className}>
        <img className="w-6 h-6 mr-2" src={img} />
        <span>{children}</span>
      </motion.a>
    </Link>
  );
}

export default FilterButton;
