import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

import { matter } from '@commons/frontMatter';
import { readPostFiles } from '@commons/fsModule';

export interface postResponseData {
  data: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<postResponseData>) {
  const {
    query: { id },
  } = req;

  if (typeof id === 'string') {
    const files = readPostFiles();

    const fileName = files.filter(({ contents }) => {
      const data = matter(contents, ['slug']);
      if (id === data.meta.slug) {
        return true;
      }
    });

    const data = fs.readFileSync(`./__posts/${fileName[0].name}`, 'utf8');

    return res.status(200).json({ data: data });
  } else {
    return res.status(500).json({ data: '' });
  }
}
