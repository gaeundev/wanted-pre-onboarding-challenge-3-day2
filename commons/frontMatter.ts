import yaml from 'js-yaml';

// 정해진 meta data만 사용
// categories, date, description, slug, tags, title
export interface Meta {
  categories?: string[];
  date?: string;
  description?: string;
  slug: string;
  tags?: string[];
  title?: string;
}

export interface MatterFunc {
  meta: Meta;
  content?: string;
}

/** options : categories, date, description, slug, tags, title, content
 */
export const matter = (contents: string, options?: string[]): MatterFunc => {
  const content = contents.split('\n');

  const metaInitial = { slug: '#' };
  let dataMeta: Meta = metaInitial;
  let dataContent = '';

  if (content[0] === '---') {
    // meta data가 있다면
    // 첫번째 --- 를 삭제하고
    content.shift();

    // 두번째 --- 의 index를 찾아서
    const metaEndIdx = content.findIndex((meta) => meta === '---');

    // 그 사이의 값들을 가져와 파싱한다.
    const metaData = content.slice(0, metaEndIdx).join('\r\n');

    const meta = yaml.load(metaData) as Meta;

    dataMeta = meta ? meta : metaInitial;

    // options에 따라 리턴할 값을 정해줌
    // categories, date, description, slug, tags, title
    if (options && !options.includes('categories')) delete dataMeta.categories;
    if (options && !options.includes('date')) delete dataMeta.date;
    if (options && !options.includes('description')) delete dataMeta.description;
    if (options && !options.includes('tags')) delete dataMeta.tags;
    if (options && !options.includes('title')) delete dataMeta.title;

    // 그 외의 값은 content로 리턴해준다.
    const contentSliceStartIdx = metaEndIdx + 2; // front-matter가 끝나고, 한 줄 띄어있기 때문에 2를 더함
    dataContent = content.slice(contentSliceStartIdx).join('\r\n');
  } else {
    dataContent = contents;
  }

  const data: MatterFunc = { meta: dataMeta };

  if (!options || options?.includes('content')) data.content = dataContent;

  return data;
};
