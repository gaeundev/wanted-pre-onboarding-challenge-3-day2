import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';

import { matter, type MatterFunc } from '@commons/frontMatter';
import { readPostFiles } from '@commons/fsModule';
import { postContentFetcher } from '@commons/fetcher';

import Title from '@components/Post/Title';
import Content from '@components/Post/Content';
import Tag from '@components/Post/Tag';

interface PostPageProps {
  paramId: string;
  fallback: { [x: string]: string };
}

interface ArticleProps {
  paramId: string;
}

const Article = ({ paramId }: ArticleProps) => {
  const { data, error } = useSWR(['posts', paramId]);

  if (error) return <>에러가 발생했습니다</>;
  if (!data) return <>불러오는 중🌀</>;

  return (
    <div className="post">
      <Title meta={data.meta} />
      <Content content={data.content ? data.content : ''} />
      {data.meta.tags && <Tag tags={data.meta.tags} />}
    </div>
  );
};

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

  if (typeof paramId !== 'string') return { props: {} };

  const res = await postContentFetcher(paramId);
  const data = res.data;

  const content = matter(data ? data : '', ['title', 'date', 'categories', 'tags', 'content']);

  return {
    props: {
      paramId: paramId,
      fallback: {
        [unstable_serialize(['posts', paramId])]: content,
      },
    },
  };
};
