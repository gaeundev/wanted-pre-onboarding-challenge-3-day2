interface TagProps {
  tags: string[];
}

const Tag = ({ tags }: TagProps) => {
  return (
    <ul className="post__tag">
      <span>TAG</span>
      {tags.map((tags, idx) => (
        <li key={idx}>#{tags}</li>
      ))}
    </ul>
  );
};

export default Tag;
