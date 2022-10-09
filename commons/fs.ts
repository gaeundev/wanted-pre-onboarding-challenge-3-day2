import fs from 'fs';
import path from 'path';

export const postFiles = () => {
  const dir = path.resolve('./__posts');

  return fs.readdirSync(dir);
};

export const readPostFiles = async () => {
  const fileNames = postFiles();

  const filesData = fileNames.map((file) => {
    return {
      name: file,
      contents: fs.readFileSync(`./__posts/${file}`, 'utf8'),
    };
  });

  return filesData;
};
