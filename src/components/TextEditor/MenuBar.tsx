import { useCallback, useRef } from 'react';
import {
  BoldIcon,
  CodeIcon,
  HeadingIcon,
  HorizontalRuleIcon,
  ItalicIcon,
  OrderedListIcon,
  ParagraphIcon,
  RedoIcon,
  StrikethroughIcon,
  UndoIcon,
  UnorderedListIcon,
  LinkIcon,
  FontIcon,
  TableIcon,
} from '../../icons';

import { twMerge } from 'tailwind-merge';
import { useCurrentEditor } from '@tiptap/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import useWindowSize from '../../hooks/useWindowSize';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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

  const baseClass = 'px-4 border-x-2  mr-2';
  const activeClass = 'bg-gray-400';

  const textDropdownMenusBaseStyle = 'w-full flex content-center';

  const textDropdownMenus: DropdownMenus[] = [
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
    <div>
      <div style={{ background: '#F1F1F5' }}>
        {size && size.witdh <= 611 ? (
          <>
            <Swiper
              slidesPerView={7}
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
            >
              <SwiperSlide>
                <div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className={twMerge(baseClass)}
                        aria-label="Show Text Options"
                      >
                        <FontIcon className="pointer-events-none" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                        sideOffset={5}
                      >
                        {textDropdownMenus.map((textDropdownMenu, i) => {
                          const { leftElement, rightIcon, ...rest } =
                            textDropdownMenu;
                          return (
                            <DropdownMenu.Item
                              className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                              key={i}
                            >
                              <button {...rest}>
                                {leftElement}
                                <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                                  {rightIcon}
                                </div>
                              </button>
                            </DropdownMenu.Item>
                          );
                        })}
                        <DropdownMenu.Arrow className="fill-white" />
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={twMerge(
                    editor.isActive('bulletList') ? activeClass : '',
                    baseClass
                  )}
                >
                  <UnorderedListIcon />
                </button>
              </SwiperSlide>
              <SwiperSlide>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={twMerge(
                    editor.isActive('orderedList') ? activeClass : '',
                    baseClass
                  )}
                >
                  <OrderedListIcon />
                </button>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className={baseClass}
                        aria-label="Show Table Options"
                      >
                        <TableIcon className="pointer-events-none" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                        sideOffset={5}
                      >
                        {tableDropdownMenus.map((tableDropdownMenu, i) => {
                          const { leftElement, rightIcon, ...rest } =
                            tableDropdownMenu;
                          return (
                            <DropdownMenu.Item
                              className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                              key={i}
                            >
                              <button {...rest}>
                                {leftElement}
                                <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                                  {rightIcon}
                                </div>
                              </button>
                            </DropdownMenu.Item>
                          );
                        })}
                        <DropdownMenu.Arrow className="fill-white" />
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <button
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={twMerge(
                    editor.isActive('codeBlock') ? activeClass : '',
                    baseClass
                  )}
                >
                  <CodeIcon />
                </button>
              </SwiperSlide>
              <SwiperSlide>
                <button
                  className={baseClass}
                  onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                  }
                >
                  <HorizontalRuleIcon />
                </button>
              </SwiperSlide>
              <SwiperSlide>
                <button
                  onClick={setLink}
                  className={twMerge(
                    editor.isActive('link') ? activeClass : '',
                    baseClass
                  )}
                >
                  <LinkIcon />
                </button>
              </SwiperSlide>
              <SwiperSlide>
                <button
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().chain().focus().undo().run()}
                  className={baseClass}
                >
                  <UndoIcon />
                </button>
              </SwiperSlide>
              <SwiperSlide>
                <button
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().chain().focus().redo().run()}
                  className={baseClass}
                >
                  <RedoIcon />
                </button>
              </SwiperSlide>
              {/* <SwiperSlide>
                <button
                  className={baseClass}
                  onClick={() => {
                    // onSave({
                    //   content: content,
                    //   title: titleRef.current?.value as string,
                    // });
                  }}
                >
                  <SaveIcon />
                </button>
              </SwiperSlide> */}
              {/* <SwiperSlide>Slide 1</SwiperSlide>
            <SwiperSlide>Slide 2</SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide> */}
            </Swiper>
          </>
        ) : (
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className={baseClass} aria-label="Show Text Options">
                  <FontIcon />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                  sideOffset={5}
                >
                  {textDropdownMenus.map((textDropdownMenu, i) => {
                    const { leftElement, rightIcon, ...rest } =
                      textDropdownMenu;
                    return (
                      <DropdownMenu.Item
                        className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                        key={i}
                      >
                        <button {...rest}>
                          {leftElement}
                          <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                            {rightIcon}
                          </div>
                        </button>
                      </DropdownMenu.Item>
                    );
                  })}
                  <DropdownMenu.Arrow className="fill-white" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={twMerge(
                editor.isActive('bulletList') ? activeClass : '',
                baseClass
              )}
            >
              <UnorderedListIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={twMerge(
                editor.isActive('orderedList') ? activeClass : '',
                baseClass
              )}
            >
              <OrderedListIcon />
            </button>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className={baseClass} aria-label="Show Table Options">
                  <TableIcon />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                  sideOffset={5}
                >
                  {tableDropdownMenus.map((tableDropdownMenu, i) => {
                    const { leftElement, rightIcon, ...rest } =
                      tableDropdownMenu;
                    return (
                      <DropdownMenu.Item
                        className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                        key={i}
                      >
                        <button {...rest}>
                          {leftElement}
                          <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                            {rightIcon}
                          </div>
                        </button>
                      </DropdownMenu.Item>
                    );
                  })}
                  <DropdownMenu.Arrow className="fill-white" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={twMerge(
                editor.isActive('codeBlock') ? activeClass : '',
                baseClass
              )}
            >
              <CodeIcon />
            </button>
            <button
              className={baseClass}
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <HorizontalRuleIcon />
            </button>
            <button
              onClick={setLink}
              className={twMerge(
                editor.isActive('link') ? activeClass : '',
                baseClass
              )}
            >
              <LinkIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className={baseClass}
            >
              <UndoIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className={baseClass}
            >
              <RedoIcon />
            </button>
          </>
        )}
      </div>
      <br />
      <input
        onChange={(e) => {
          setSaveStatus('saving');
          setTitle(e.target.value);
        }}
        value={title}
        className={twMerge('p-2.5', 'mt-5', 'w-full h-10')}
        type="text"
        placeholder="This is a title"
      />
    </div>
  );
};

export default MenuBar;
