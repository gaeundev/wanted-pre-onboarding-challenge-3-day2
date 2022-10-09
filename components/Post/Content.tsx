import { markdownParser } from '@commons/parse';

interface ContentProps {
  content: string;
}

const Content = ({ content }: ContentProps) => {
  return (
    <>
      <div className="post__content" dangerouslySetInnerHTML={{ __html: markdownParser(content) }}></div>
    </>
  );
};

export default Content;
