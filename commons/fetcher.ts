import { matter } from './frontMatter';
import { readPostFiles } from './fsModule';
import fs from 'fs';

export default async function fetcher(url: string) {
  const files = await readPostFiles();

  const fileName = files.filter(({ contents }) => {
    const data = matter(contents, ['slug']);
    if (url === data.meta.slug) {
      return true;
    }
  });

  const data = await fs.readFileSync(`./__posts/${fileName[0].name}`, 'utf8');

  return data;
}
