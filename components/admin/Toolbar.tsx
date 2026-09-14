import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Type,
  Palette,
  Highlighter,
  WrapText,
  Link as LinkIcon,
  Unlink,
  Superscript,
  Subscript,
  Heading2,
  Heading3,
  Eraser,
  Pilcrow,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToolbarProps {
  editor: Editor | null;
  isWordWrap: boolean;
  toggleWordWrap: () => void;
}

const fonts = [
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
];

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];

const colors = ['#000000', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#64748b'];
const highlights = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#ddd6fe', '#ffedd5'];

const buttonClass = (active = false) =>
  cn(
    'p-1.5 rounded hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
    active && 'bg-blue-100 text-blue-600',
  );

const Toolbar: React.FC<ToolbarProps> = ({ editor, isWordWrap, toggleWordWrap }) => {
  if (!editor) return null;

  const activeFontFamily = editor.getAttributes('textStyle').fontFamily || '';
  const activeFontSize = editor.getAttributes('textStyle').fontSize || '';
  const keepSelection = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href || 'https://';
    const url = window.prompt('Bağlantı adresini girin', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white p-2 shadow-sm">
      <div className="mr-2 flex items-center gap-1 border-r border-gray-200 pr-2">
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={buttonClass()} title="Geri Al">
          <Undo size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={buttonClass()} title="İleri Al">
          <Redo size={18} />
        </button>
      </div>

      <div className="mr-2 flex items-center gap-1 border-r border-gray-200 pr-2">
        <div className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1">
          <Type size={16} className="text-gray-500" />
          <select
            value={activeFontFamily}
            onChange={(event) => {
              const value = event.target.value;
              if (!value) {
                editor.chain().focus().unsetFontFamily().run();
                return;
              }
              editor.chain().focus().setFontFamily(value).run();
            }}
            className="bg-transparent text-xs font-medium text-gray-700 outline-none"
            title="Yazı Tipi"
          >
            <option value="">Montserrat</option>
            {fonts.map((font) => (
              <option key={font.name} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1">
          <select
            value={activeFontSize}
            onChange={(event) => {
              const value = event.target.value;
              if (!value) {
                editor.chain().focus().unsetFontSize().run();
                return;
              }
              editor.chain().focus().setFontSize(value).run();
            }}
            className="bg-transparent text-xs font-medium text-gray-700 outline-none"
            title="Yazı Boyutu"
          >
            <option value="">Boyut</option>
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size.replace('px', '')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mr-2 flex items-center gap-1 border-r border-gray-200 pr-2">
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))} title="Kalın">
          <Bold size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))} title="İtalik">
          <Italic size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass(editor.isActive('underline'))} title="Altı Çizili">
          <UnderlineIcon size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))} title="Üstü Çizili">
          <Strikethrough size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleSubscript().run()} className={buttonClass(editor.isActive('subscript'))} title="Alt Simge">
          <Subscript size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleSuperscript().run()} className={buttonClass(editor.isActive('superscript'))} title="Üst Simge">
          <Superscript size={18} />
        </button>
      </div>

      <div className="mr-2 flex items-center gap-1 border-r border-gray-200 pr-2">
        <div className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1">
          <Palette size={16} className="text-gray-500" />
          <div className="flex items-center gap-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onMouseDown={keepSelection}
                onClick={() => editor.chain().focus().setColor(color).run()}
                className="h-4 w-4 rounded-full border border-gray-200 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                title={`Yazı rengi ${color}`}
              />
            ))}
            <button
              type="button"
              onMouseDown={keepSelection}
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="ml-1 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 hover:bg-gray-100"
              title="Yazı rengini temizle"
            >
              X
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1">
          <Highlighter size={16} className="text-gray-500" />
          <div className="flex items-center gap-1">
            {highlights.map((highlight) => (
              <button
                key={highlight}
                type="button"
                onMouseDown={keepSelection}
                onClick={() => editor.chain().focus().setHighlight({ color: highlight }).run()}
                className="h-4 w-4 rounded-full border border-gray-200 transition-transform hover:scale-110"
                style={{ backgroundColor: highlight }}
                title={`Vurgu rengi ${highlight}`}
              />
            ))}
            <button
              type="button"
              onMouseDown={keepSelection}
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              className="ml-1 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 hover:bg-gray-100"
              title="Vurguyu temizle"
            >
              X
            </button>
          </div>
        </div>
      </div>

      <div className="mr-2 flex items-center gap-1 border-r border-gray-200 pr-2">
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonClass(editor.isActive({ textAlign: 'left' }))} title="Sola Hizala">
          <AlignLeft size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonClass(editor.isActive({ textAlign: 'center' }))} title="Ortala">
          <AlignCenter size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonClass(editor.isActive({ textAlign: 'right' }))} title="Sağa Hizala">
          <AlignRight size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={buttonClass(editor.isActive({ textAlign: 'justify' }))} title="İki Yana Yasla">
          <AlignJustify size={18} />
        </button>
      </div>

      <div className="mr-2 flex items-center gap-1 border-r border-gray-200 pr-2">
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))} title="Madde İşaretli Liste">
          <List size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))} title="Numaralı Liste">
          <ListOrdered size={18} />
        </button>
      </div>

      <div className="mr-2 flex items-center gap-1 border-r border-gray-200 pr-2">
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().setParagraph().run()} className={buttonClass(editor.isActive('paragraph'))} title="Paragraf">
          <Pilcrow size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))} title="Başlık 2">
          <Heading2 size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass(editor.isActive('heading', { level: 3 }))} title="Başlık 3">
          <Heading3 size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass(editor.isActive('blockquote'))} title="Alıntı">
          <Quote size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={buttonClass(editor.isActive('codeBlock'))} title="Kod Bloğu">
          <Code size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button type="button" onMouseDown={keepSelection} onClick={setLink} className={buttonClass(editor.isActive('link'))} title="Bağlantı Ekle">
          <LinkIcon size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={() => editor.chain().focus().unsetLink().run()} className={buttonClass(false)} title="Bağlantıyı Kaldır">
          <Unlink size={18} />
        </button>
        <button
          type="button"
          onMouseDown={keepSelection}
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetAllMarks()
              .clearNodes()
              .unsetColor()
              .unsetHighlight()
              .unsetFontFamily()
              .unsetFontSize()
              .run()
          }
          className={buttonClass(false)}
          title="Biçimi Temizle"
        >
          <Eraser size={18} />
        </button>
        <button type="button" onMouseDown={keepSelection} onClick={toggleWordWrap} className={buttonClass(isWordWrap)} title="Satır Kaydırma">
          <WrapText size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
