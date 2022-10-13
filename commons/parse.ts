import { fromMarkdown } from 'mdast-util-from-markdown';
import { Content } from 'mdast-util-from-markdown/lib';

export const markdownParser = (content: string) => {
  const tree = fromMarkdown(content);
  const innerHTML = tree.children.map((child, idx) => markHTML(child)).join('');

  return innerHTML;
};

const codeTagToBacktick = (content: string): string => {
  return content
    .split('`')
    .map((v) => `<code>${v}</code>`)
    .join('`');
};

const paragraphParse = (contents: Content[]) => {
  return contents
    .map((paragraph) =>
      paragraph.type === 'text'
        ? linkParse(paragraph.value)
        : paragraph.type === 'inlineCode'
        ? linkParse(codeTagToBacktick(paragraph.value))
        : '',
    )
    .join('');
};

const linkParse = (content: string) => {
  // 현재는 링크 뒤에 텍스트가 붙히면 오류가 발생함
  // 어떻게 regex에 해당하는 text만 뽑아해서 content에 넣어줄 수 있을지 더 찾아보기
  const regex =
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
  const linkTxt = content.replace(regex, `<a href="${content}" target="_blank">${content}</a>`);
  return linkTxt.replace('\r\n', `<br/>`);
};

const markHTML = (child: Content) => {
  let innerHTML = '';
  try {
    if (child.type && child.type === 'heading') {
      const value = child.children[0].type === 'text' ? child.children[0].value : '';
      const headingTag = `<h${child.depth}>${value}</h${child.depth}>`;
      innerHTML = headingTag;
    }

    if (child.type && child.type === 'list') {
      const listItems = child.children?.filter(({ type }) => type && type === 'listItem');
      const list = `<ul>${listItems
        .map((value) => {
          const paragraphs = value.children[0]?.type === 'paragraph' ? value.children[0].children : [];
          const listItem = paragraphParse(paragraphs);
          return `<li>${listItem}</li>`;
        })
        .join('')}</ul>`;

      innerHTML = list;
    }

    if (child.type && child.type === 'paragraph') {
      const paragraph = paragraphParse(child.children);

      innerHTML = paragraph;
    }
  } catch (err) {
    console.error('parsing error');
  }

  return innerHTML;
};
