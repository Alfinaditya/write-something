import { EditorProvider } from '@tiptap/react';
import MenuBar from './MenuBar';
import React, { useEffect, useState } from 'react';
import extensions from './extensions';
import useDebounce from '../../hooks/useDebounce';
// import { useBeforeunload } from 'react-beforeunload';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';

interface RootProps {
  defaultContent: string;
  defaultTitle: string;
  onSave: ({ title, content }: { title: string; content: string }) => void;
}

const TextEditor: React.FC<RootProps> = ({
  defaultContent,
  defaultTitle,
  onSave,
}) => {
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved'>('saved');
  const [content, setContent] = useState(defaultContent);
  const [title, setTitle] = useState(defaultTitle);
  const contentDebounceValue = useDebounce(content, 500);
  const titleDebounceValue = useDebounce(title, 500);
  useBlocker(() => {
    if (saveStatus === 'saving') {
      return !window.confirm(
        'You have unsaved changes. Are you sure you want to leave this page?'
      );
    }
    return false;
  });

  // useBeforeunload(
  //   saveStatus === 'saving' ? (event) => event.preventDefault() : null
  // );
  // useEffect(() => {
  //   const handleBeforeUnload = (e: any) => {
  //     if (saveStatus === 'saving') {
  //       e.preventDefault();
  //       e.returnValue =
  //         'You have unsaved changes. Are you sure you want to leave this page?';
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [saveStatus]);
  useEffect(() => {
    function handleSave() {
      onSave({
        content: content,
        title: title,
      });
      setSaveStatus('saved');
    }
    handleSave();
  }, [contentDebounceValue, titleDebounceValue]);

  return (
    <>
      {/* {saveStatus} */}
      <EditorProvider
        slotBefore={
          <MenuBar
            setSaveStatus={setSaveStatus}
            setTitle={setTitle}
            title={title}
          />
        }
        extensions={extensions}
        content={content}
        onUpdate={({ editor }) => {
          setSaveStatus('saving');
          setContent(editor.getHTML());
        }}
        children
      />
    </>
  );
};
// function Prompt(props) {
//   const block = props.when

//   useBlocker(() => {
//       if (block) {
//           return ! window.confirm(props.message)
//       }
//       return false
//   })

// return (
//   <div key={block}/>
// )
// }

export default TextEditor;
