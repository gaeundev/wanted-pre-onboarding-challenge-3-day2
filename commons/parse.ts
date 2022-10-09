import { fromMarkdown } from 'mdast-util-from-markdown';
import { Content } from 'mdast-util-from-markdown/lib';

export const markdownParser = (content: string) => {
  const tree = fromMarkdown(content);
  const innerHTML = tree.children.map((child, idx) => markHTML(child)).join('');

  return innerHTML;
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
          const listItem = paragraphs
            .map((paragraph) => (paragraph.type === 'text' ? `<li>${paragraph.value}</li>` : null))
            .join('');
          return listItem;
        })
        .join('')}</ul>`;

      innerHTML = list;
    }
  } catch (err) {
    console.error('parsing error');
  }

  return innerHTML;
};
