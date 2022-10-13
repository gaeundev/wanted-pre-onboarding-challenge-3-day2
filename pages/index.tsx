import { GetStaticProps } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';

import { readPostFiles } from '@commons/fsModule';
import { matter, MatterFunc } from '@commons/frontMatter';

import ListItem from '@components/PostList/ListItem';
import ListWrapper from '@components/PostList/ListWrapper';

interface HomeProps {
  postLists: MatterFunc[];
}

const Home: NextPage<HomeProps> = ({ postLists }) => {
  return (
    <>
      <Head>
        <title>직접 만드는 블로그💪</title>
        <meta name="description" content="직접 만드는 블로그" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {postLists && (
          <ListWrapper>
            {postLists.map(
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
          </ListWrapper>
        )}
      </main>
    </>
  );
};

export default Home;

// 정적 페이지를 생성할 때 필요한 데이터 생성
export const getStaticProps: GetStaticProps = async () => {
  const data = await readPostFiles();

  const postLists: MatterFunc[] = data.map(({ contents }) =>
    matter(contents, ['title', 'slug', 'categories', 'date', 'description']),
  );

  return {
    props: { postLists: postLists },
  };
};
