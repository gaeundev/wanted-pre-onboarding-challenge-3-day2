import fs from 'fs';

import { readPostFiles } from '@commons/fsModule';
import { matter } from '@commons/frontMatter';

export const postListsFetcher = async (): Promise<{
  data: {
    name: string;
    contents: string;
  }[];
}> => {
  const files = await readPostFiles();
  return { data: files };
};

export const postContentFetcher = async (paramId: string): Promise<{ data: string }> => {
  const files = await readPostFiles();

  const fileName = files.filter(({ contents }) => {
    const data = matter(contents, ['slug']);
    if (paramId === data.meta.slug) {
      return true;
    }
  });

  const content = fs.readFileSync(`./__posts/${fileName[0].name}`, 'utf8');
  return { data: content };
};
