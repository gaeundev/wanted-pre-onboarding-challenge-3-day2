import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export interface PostsData {
  name: string;
  contents: string;
}

export interface ListResponseData {
  data: PostsData[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ListResponseData>) {
  try {
    const dir = path.resolve('./__posts');
    const fileNames = fs.readdirSync(dir);

    const filesData = fileNames.map((file) => {
      return {
        name: file,
        contents: fs.readFileSync(`./__posts/${file}`, 'utf8'),
      };
    });

    return res.status(200).json({ data: filesData });
  } catch (err) {
    return res.status(500);
  }
}
