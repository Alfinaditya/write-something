import { useCallback } from 'react';
import {
  BoldIcon,
  HeadingIcon,
  ItalicIcon,
  ParagraphIcon,
  StrikethroughIcon,
} from '../../icons';

import { twMerge } from 'tailwind-merge';
import { useCurrentEditor } from '@tiptap/react';
import useWindowSize from '../../hooks/useWindowSize';
import 'swiper/css';
import Mobile from './MenuBar/Mobile';
import Desktop from './MenuBar/Desktop';

interface Props {
  title: string | undefined;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setSaveStatus: React.Dispatch<React.SetStateAction<'saving' | 'saved'>>;
}
interface Buttons extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Additional custom props if needed
  icon: JSX.Element;
}

interface DropdownMenus extends Omit<Buttons, 'icon'> {
  rightIcon: JSX.Element;
  leftElement: JSX.Element;
}

const MenuBar: React.FC<Props> = ({ title, setTitle, setSaveStatus }) => {
  // const titleRef = useRef<null | HTMLInputElement>(null);
  const { editor } = useCurrentEditor();
  const size = useWindowSize();

  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const activeClass = 'fill-main text-main';

  const textDropdownMenusBaseStyle = 'w-full flex content-center';

  const textDropdownMenus = [
    {
      rightIcon: <BoldIcon />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      className: twMerge(
        editor.isActive('bold') ? activeClass : '',
        textDropdownMenusBaseStyle
      ),
      leftElement: <b>Bold</b>,
    },
    {
      rightIcon: <ItalicIcon />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      className: twMerge(
        editor.isActive('italic') ? activeClass : '',
        textDropdownMenusBaseStyle
      ),
      leftElement: <i>Italic</i>,
    },
    {
      leftElement: <s>Strikethrough</s>,
      rightIcon: <StrikethroughIcon />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
      className: twMerge(
        editor.isActive('strike') ? activeClass : '',
        textDropdownMenusBaseStyle
      ),
    },
    {
      leftElement: <p>Paragraph</p>,
      rightIcon: <ParagraphIcon />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      className: twMerge(
        editor.isActive('paragraph') ? activeClass : '',
        textDropdownMenusBaseStyle
      ),
    },
    {
      leftElement: <h2>Heading</h2>,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      className: twMerge(
        editor.isActive('heading', { level: 2 }) ? activeClass : '',
        textDropdownMenusBaseStyle
      ),
      rightIcon: <HeadingIcon />,
    },
  ];

  const tableDropdownMenus: DropdownMenus[] = [
    {
      rightIcon: <></>,
      onClick: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      className: twMerge(textDropdownMenusBaseStyle),
      leftElement: <p>Insert Table</p>,
    },
    {
      rightIcon: <></>,
      onClick: () => editor.chain().focus().addRowAfter().run(),
      className: twMerge(textDropdownMenusBaseStyle),
      leftElement: <p>Add Row</p>,
    },
    {
      rightIcon: <></>,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
      className: twMerge(textDropdownMenusBaseStyle),
      leftElement: <p>Add Column</p>,
    },
    {
      rightIcon: <></>,
      onClick: () => () => editor.chain().focus().deleteTable().run(),
      className: twMerge(textDropdownMenusBaseStyle),
      leftElement: <p>Delete Table</p>,
    },
    // () => editor.chain().focus().deleteTable().run()
    // <button onClick={() => editor.chain().focus().addRowAfter().run()}>addRowAfter</button>
  ];

  return (
    <>
      {size && size.witdh <= 611 ? (
        <Mobile
          setLink={setLink}
          tableDropdownMenus={tableDropdownMenus}
          textDropdownMenus={textDropdownMenus}
          editor={editor}
        />
      ) : (
        <Desktop
          setLink={setLink}
          tableDropdownMenus={tableDropdownMenus}
          textDropdownMenus={textDropdownMenus}
          editor={editor}
        />
      )}
      <br />
      <input
        onChange={(e) => {
          setSaveStatus('saving');
          setTitle(e.target.value);
        }}
        value={title}
        className={twMerge(
          'p-2.5',
          'mt-5',
          'w-full h-10',
          'bg-gray-50',
          'outline-none'
        )}
        type="text"
        placeholder="This is a title"
      />
    </>
  );
};

export default MenuBar;
