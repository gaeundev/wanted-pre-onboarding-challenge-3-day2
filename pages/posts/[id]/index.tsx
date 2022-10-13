import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import useSWR, { SWRConfig } from 'swr';
import fs from 'fs';

import { matter } from '@commons/frontMatter';
import type { MatterFunc } from '@commons/frontMatter';
import { readPostFiles } from '@commons/fsModule';
import fetcher from '@commons/fetcher';

import Title from '@components/Post/Title';
import Content from '@components/Post/Content';
import Tag from '@components/Post/Tag';

interface PostPageProps {
  paramId: string;
  fallback: { [x: string]: string };
}

function Article({ paramId }: { paramId: string }) {
  const { data } = useSWR(paramId, fetcher);

  const contents = matter(data ? data : '', ['title', 'date', 'categories', 'tags', 'content']);

  return (
    <div className="post">
      <Title meta={contents.meta} />
      <Content content={contents.content ? contents.content : ''} />
      {contents.meta.tags && <Tag tags={contents.meta.tags} />}
    </div>
  );
}

const PostPage: NextPage<PostPageProps> = ({ paramId, fallback }) => {
  return (
    <>
      <SWRConfig value={{ fallback }}>
        <Article paramId={paramId} />
      </SWRConfig>
    </>
  );
};

export default PostPage;

// 각 포스트를 그려줄 상세 페이지 경로를 생성
export const getStaticPaths: GetStaticPaths = async () => {
  const data = readPostFiles();
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

  if (typeof paramId !== 'string') return { props: {} };

  const files = readPostFiles();

  const fileName = files.filter(({ contents }) => {
    const data = matter(contents, ['slug']);
    if (paramId === data.meta.slug) {
      return true;
    }
  });

  const data = fs.readFileSync(`./__posts/${fileName[0].name}`, 'utf8');

  return {
    props: {
      paramId: paramId,
      fallback: {
        [paramId]: data,
      },
    },
  };
};
