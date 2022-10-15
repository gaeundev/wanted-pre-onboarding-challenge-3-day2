import { GetStaticProps } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import useSWR, { SWRConfig, unstable_serialize } from 'swr';

import { matter, Meta, type MatterFunc } from '@commons/frontMatter';
import { postListsFetcher } from '@commons/fetcher';

import ListItem from '@components/PostList/ListItem';
import ListWrapper from '@components/PostList/ListWrapper';

interface HomeProps {
  fallback: { [x: string]: MatterFunc[] };
}

const PostList = () => {
  const { data, error } = useSWR(['posts']);

  if (error) return <>에러가 발생했습니다</>;
  if (!data) return <>불러오는 중🌀</>;

  console.log('data:');
  console.log(data);
  console.log('-------------------------------');

  const postLists: {
    meta: Meta;
  }[] = data;

  console.log('postLists:');
  console.log(postLists);
  console.log('-------------------------------');

  return (
    <div>
      {postLists &&
        postLists.map(
          (post, idx) =>
            post.meta && (
              <ListItem
                key={idx}
                path={post.meta.slug}
                title={post.meta.title || '제목이 없습니다'}
                categories={post.meta.categories}
                date={post.meta.date}
                description={post.meta.description}
              />
            ),
        )}
    </div>
  );
};

const Home: NextPage<HomeProps> = ({ fallback }) => {
  return (
    <>
      <Head>
        <title>직접 만드는 블로그💪</title>
        <meta name="description" content="직접 만드는 블로그" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <SWRConfig value={{ fallback }}>
          <ListWrapper>
            <PostList />
          </ListWrapper>
        </SWRConfig>
      </main>
    </>
  );
};

export default Home;

// 정적 페이지를 생성할 때 필요한 데이터 생성
export const getStaticProps: GetStaticProps = async () => {
  const res = await postListsFetcher();

  const data: {
    name: string;
    contents: string;
  }[] = res.data;

  const postLists: MatterFunc[] = data.map(({ contents }) =>
    matter(contents, ['title', 'slug', 'categories', 'date', 'description']),
  );

  console.log(postLists);

  return {
    props: { fallback: { [unstable_serialize(['posts'])]: postLists } },
  };
};
