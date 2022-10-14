interface ListWrapperProps {
  children: JSX.Element[] | JSX.Element;
}

const ListWrapper = ({ children }: ListWrapperProps) => {
  return (
    <>
      <h2>전체 글</h2>
      <ul className="post__list">{children}</ul>
    </>
  );
};

export default ListWrapper;
