import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <Link href="/">
        <a>
          <h1>B L O G</h1>
        </a>
      </Link>
    </header>
  );
};

export default Header;
