import { GetStaticProps } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import useSWR, { SWRConfig } from 'swr';

import { matter, type MatterFunc } from '@commons/frontMatter';
import { fetcher, postListsFetcher } from '@commons/fetcher';

import type { PostsData, ListResponseData } from '@pages/api/posts';

import ListItem from '@components/PostList/ListItem';
import ListWrapper from '@components/PostList/ListWrapper';

interface HomeProps {
  postLists: MatterFunc[];
  fallback: { '/api/posts': MatterFunc[] };
}

const API = '/api/posts';

function Repo() {
  const { data, error } = useSWR(API, fetcher);

  if (error) return <>에러가 발생했습니다</>;
  if (!data || !data.data) return <>불러오는 중🌀</>;

  const lists: PostsData[] = data.data;
  const postLists = lists.map(({ contents }) =>
    matter(contents, ['title', 'slug', 'categories', 'date', 'description']),
  );

  return (
    <div>
      {postLists &&
        postLists.map(
          (post, idx) =>
            post.meta && (
              <ListItem
                key={idx}
                path={post.meta.slug || '#'}
                title={post.meta.title || '제목이 없습니다'}
                categories={post.meta.categories}
                date={post.meta.date}
                description={post.meta.description}
              />
            ),
        )}
    </div>
  );
}

const Home: NextPage<HomeProps> = ({ postLists, fallback }) => {
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
            <Repo />
          </ListWrapper>
        </SWRConfig>
      </main>
    </>
  );
};

export default Home;

// 정적 페이지를 생성할 때 필요한 데이터 생성
export const getStaticProps: GetStaticProps = async () => {
  const res: ListResponseData = postListsFetcher();

  const data: PostsData[] = res.data;
  const postLists: MatterFunc[] = data.map(({ contents }) =>
    matter(contents, ['title', 'slug', 'categories', 'date', 'description']),
  );

  return {
    props: { postLists: postLists, fallback: { [API]: postLists } },
  };
};
