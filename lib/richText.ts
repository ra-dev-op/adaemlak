const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const allowedTags = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'DEL', 'SPAN', 'FONT', 'MARK', 'H1', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'A', 'SUP', 'SUB', 'PRE', 'CODE']);

const normalizeColor = (value: string) => {
  const trimmed = value.trim();
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(trimmed)) {
    return trimmed;
  }

  const rgbMatch = trimmed.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgbMatch) {
    return '';
  }

  return trimmed;
};

const normalizeSize = (value: string) => {
  const trimmed = value.trim().toLowerCase();
  if (/^\d+px$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d+(\.\d+)?rem$/.test(trimmed)) {
    return trimmed;
  }
  return '';
};

const normalizeFontFamily = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed
    .split(',')
    .map((part) => part.replace(/[^a-z0-9\s"'-]/gi, '').trim())
    .filter(Boolean)
    .join(', ');
};

const normalizeTextAlign = (value: string) => {
  const trimmed = value.trim().toLowerCase();
  return ['left', 'center', 'right', 'justify'].includes(trimmed) ? trimmed : '';
};

const buildStyleAttribute = (styles: Record<string, string>) =>
  Object.entries(styles)
    .filter(([, styleValue]) => styleValue)
    .map(([styleName, styleValue]) => `${styleName}: ${styleValue};`)
    .join(' ');

const sanitizeNode = (node: Node, targetDocument: Document): Node | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    return targetDocument.createTextNode(node.textContent || '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toUpperCase();

  if (!allowedTags.has(tagName)) {
    const fragment = targetDocument.createDocumentFragment();
    Array.from(element.childNodes).forEach((child) => {
      const sanitizedChild = sanitizeNode(child, targetDocument);
      if (sanitizedChild) {
        fragment.appendChild(sanitizedChild);
      }
    });
    return fragment;
  }

  const sanitizedElement = targetDocument.createElement(tagName === 'FONT' ? 'span' : tagName.toLowerCase());

  const inlineStyles: Record<string, string> = {};

  const color = normalizeColor(element.style.color || element.getAttribute('color') || '');
  const backgroundColor = normalizeColor(element.style.backgroundColor || '');
  const fontSize = normalizeSize(element.style.fontSize || '');
  const fontFamily = normalizeFontFamily(element.style.fontFamily || element.getAttribute('face') || '');
  const textAlign = normalizeTextAlign(element.style.textAlign || '');

  if (color) inlineStyles.color = color;
  if (backgroundColor) inlineStyles['background-color'] = backgroundColor;
  if (fontSize) inlineStyles['font-size'] = fontSize;
  if (fontFamily) inlineStyles['font-family'] = fontFamily;
  if (textAlign && ['P', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'LI', 'SPAN', 'FONT', 'MARK', 'PRE', 'CODE'].includes(tagName)) {
    inlineStyles['text-align'] = textAlign;
  }

  const styleAttribute = buildStyleAttribute(inlineStyles);
  if (styleAttribute) {
    sanitizedElement.setAttribute('style', styleAttribute);
  }

  if (tagName === 'A') {
    const href = (element.getAttribute('href') || '').trim();
    if (/^(https?:|mailto:|tel:|\/)/i.test(href)) {
      sanitizedElement.setAttribute('href', href);
      sanitizedElement.setAttribute('target', '_blank');
      sanitizedElement.setAttribute('rel', 'noopener noreferrer');
    }
  }

  Array.from(element.childNodes).forEach((child) => {
    const sanitizedChild = sanitizeNode(child, targetDocument);
    if (sanitizedChild) {
      sanitizedElement.appendChild(sanitizedChild);
    }
  });

  return sanitizedElement;
};

export const sanitizeRichTextHtml = (value: string = '') => {
  const html = value.trim();
  if (!html) {
    return '';
  }

  if (typeof window === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const wrapper = parsed.body.firstElementChild;
  if (!wrapper) {
    return '';
  }

  const cleanDocument = document.implementation.createHTMLDocument('');
  const cleanWrapper = cleanDocument.createElement('div');

  Array.from(wrapper.childNodes).forEach((child) => {
    const sanitizedChild = sanitizeNode(child, cleanDocument);
    if (sanitizedChild) {
      cleanWrapper.appendChild(sanitizedChild);
    }
  });

  return cleanWrapper.innerHTML.trim();
};

export const plainTextToRichHtml = (value: string = '') => {
  const text = value.trim();
  if (!text) {
    return '';
  }

  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`);

  return blocks.join('');
};

export const getRichDescriptionHtml = (value: string = '') => {
  if (!value.trim()) {
    return '';
  }

  if (/<[a-z][\s\S]*>/i.test(value)) {
    return sanitizeRichTextHtml(value);
  }

  return plainTextToRichHtml(value);
};

export const stripHtmlTags = (value: string = '') => {
  if (!value) {
    return '';
  }

  if (typeof window === 'undefined') {
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${value}</div>`, 'text/html');
  return parsed.body.textContent?.replace(/\s+/g, ' ').trim() || '';
};
