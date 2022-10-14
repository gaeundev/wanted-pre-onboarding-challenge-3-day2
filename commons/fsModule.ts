import fs from 'fs';
import path from 'path';

export const readPostFiles = () => {
  const dir = path.resolve('./__posts');
  const fileNames = fs.readdirSync(dir);

  const filesData = fileNames.map((file) => {
    return {
      name: file,
      contents: fs.readFileSync(`./__posts/${file}`, 'utf8'),
    };
  });

  return filesData;
};
