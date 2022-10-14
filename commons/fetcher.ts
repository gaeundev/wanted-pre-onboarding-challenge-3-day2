import fs from 'fs';

import { readPostFiles } from '@commons/fsModule';
import { matter } from '@commons/frontMatter';

import { ListResponseData } from '@pages/api/posts';
import { postResponseData } from '@pages/api/posts/[id]';

export async function fetcher(url: string) {
  const BASE_URL =
    process.env.NODE_ENV === 'production' ? `https://next-app-gaeundev.vercel.app` : `http://localhost:3000`;

  return fetch(`${BASE_URL}${url}`).then((res) => res.json());
}

export const postListsFetcher = (): ListResponseData => {
  const files = readPostFiles();
  return { data: files };
};

export const postContentFetcher = (paramId: string): postResponseData => {
  const files = readPostFiles();

  const fileName = files.filter(({ contents }) => {
    const data = matter(contents, ['slug']);
    if (paramId === data.meta.slug) {
      return true;
    }
  });

  const content = fs.readFileSync(`./__posts/${fileName[0].name}`, 'utf8');
  return { data: content };
};
