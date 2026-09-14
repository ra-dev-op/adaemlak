import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { CharacterCount } from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Placeholder } from '@tiptap/extension-placeholder';
import Toolbar from './Toolbar';
import FontSize from './FontSize';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value = '',
  onChange,
  placeholder = 'Yazmaya başlayın...',
}) => {
  const [isWordWrap, setIsWordWrap] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      Subscript,
      Superscript,
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'min-h-[520px] max-w-none px-6 py-5 font-sans text-[15px] leading-7 text-[#2c3338] focus:outline-none',
          '[&_a]:font-medium [&_a]:text-[#2271b1] [&_a]:underline',
          '[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#72aee6] [&_blockquote]:bg-[#f6f7f7] [&_blockquote]:px-4 [&_blockquote]:py-3',
          '[&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:text-[#1d2327]',
          '[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:text-[#1d2327]',
          '[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-[21px] [&_h3]:font-semibold [&_h3]:text-[#1d2327]',
          '[&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3',
          '[&_mark]:rounded-[2px] [&_mark]:px-1',
          !isWordWrap && 'whitespace-pre overflow-x-auto',
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    const nextHtml = value || '';

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>

      <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
        <div className="flex items-end justify-between border-b border-[#c3c4c7] bg-[#f6f7f7] px-3 pt-2">
          <div className="flex items-end gap-1">
            <div className="rounded-t-md border border-b-0 border-[#c3c4c7] bg-white px-4 py-2 text-[13px] font-semibold text-[#1d2327]">
              Görsel
            </div>
          </div>

          <div className="pb-2 text-[11px] font-medium text-[#646970]">
            {editor?.storage.characterCount?.words() || 0} kelime
          </div>
        </div>

        <Toolbar
          editor={editor}
          isWordWrap={isWordWrap}
          toggleWordWrap={() => setIsWordWrap(!isWordWrap)}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto mb-4 min-h-[720px] max-w-4xl rounded-lg border border-gray-200 bg-white shadow-sm">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#c3c4c7] bg-[#f6f7f7] px-3 py-2 text-[11px] text-[#646970]">
          <span>
            {editor?.storage.characterCount?.characters() || 0} karakter
          </span>
          <span>
            {editor?.storage.characterCount?.words() || 0} kelime
          </span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
