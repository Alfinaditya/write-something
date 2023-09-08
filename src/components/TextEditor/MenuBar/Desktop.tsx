import { Editor } from '@tiptap/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  CodeIcon,
  FontIcon,
  HorizontalRuleIcon,
  LinkIcon,
  OrderedListIcon,
  RedoIcon,
  TableIcon,
  UndoIcon,
  UnorderedListIcon,
} from '../../../icons';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface DropdownMenus {
  rightIcon: JSX.Element;
  leftElement: JSX.Element;
}

interface Props {
  editor: Editor;
  textDropdownMenus: DropdownMenus[];
  tableDropdownMenus: DropdownMenus[];
  setLink: () => void;
}

const Desktop: React.FC<Props> = ({
  editor,
  setLink,
  tableDropdownMenus,
  textDropdownMenus,
}) => {
  const baseClass = 'p-4 border';
  const activeClass = 'bg-gray-400';
  return (
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
              const { leftElement, rightIcon, ...rest } = textDropdownMenu;
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
              const { leftElement, rightIcon, ...rest } = tableDropdownMenu;
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
  );
};

export default Desktop;
