import Link from 'next/link';

interface ListItemProps {
  key: number;
  path: string;
  title: string;
  categories?: string[];
  date?: string;
  description?: string;
}

const ListItem = ({ key, path, title, categories, date, description }: ListItemProps) => {
  return (
    <li key={key}>
      <Link href={`/${path}`}>
        <a>
          <h3>{title}</h3>
          <div className="post__info">
            <span className="category"> {categories && categories[0]}</span> <span className="date">· {date}</span>
          </div>
          <div className="post__description">{description}</div>
        </a>
      </Link>
    </li>
  );
};

export default ListItem;
