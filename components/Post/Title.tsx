import { Meta } from '@commons/frontMatter';

interface CategoryProps {
  categories: string[];
}

const Category = ({ categories }: CategoryProps) => {
  return (
    <ul className="post__category">
      {categories.map((category, idx) => (
        <li key={idx}>{category}</li>
      ))}
    </ul>
  );
};

const Title = ({ meta: { title, date, categories } }: { meta: Meta }) => {
  return (
    <div className="post__title">
      {categories && <Category categories={categories} />}
      <h2>{title}</h2>
      <div className="post__date">{date}</div>
    </div>
  );
};

export default Title;
