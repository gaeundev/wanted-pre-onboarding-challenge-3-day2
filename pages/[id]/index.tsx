import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import fs from 'fs';

import { matter } from '@commons/frontMatter';
import { MatterFunc } from '@commons/frontMatter';
import { readPostFiles } from '@commons/fs';

import Title from '@components/Post/Title';
import Content from '@components/Post/Content';
import Tag from '@components/Post/Tag';

interface PostPageProps {
  contents: MatterFunc;
}

const PostPage: NextPage<PostPageProps> = ({ contents: { meta, content } }) => {
  return (
    <div className="post">
      <Title meta={meta} />
      <Content content={content ? content : ''} />
      {meta.tags && <Tag tags={meta.tags} />}
    </div>
  );
};

export default PostPage;

// 각 포스트를 그려줄 상세 페이지 경로를 생성
export const getStaticPaths: GetStaticPaths = async () => {
  const data = await readPostFiles();
  const postLists: MatterFunc[] = data.map(({ contents }) => matter(contents, ['slug']));

  const params = postLists.map(({ meta: { slug } }) => {
    return { params: { id: slug } };
  });

  return {
    paths: params,
    fallback: false, // 지정된 경로가 없을 때 404 페이지를 리턴함
  };
};

// 정적 페이지를 생성할 때 필요한 데이터 생성
export const getStaticProps: GetStaticProps = async (context) => {
  const paramId = context.params?.id;

  // 파일 명 검색
  const files = await readPostFiles();
  const fileName = files.filter(({ contents }) => {
    const data = matter(contents, ['slug']);
    if (paramId === data.meta.slug) {
      return true;
    }
  });

  const data = fs.readFileSync(`./__posts/${fileName[0].name}`, 'utf8');

  const contents = matter(data, ['title', 'date', 'categories', 'tags', 'content']);

  return {
    props: { contents },
  };
};
