import { useEffect, useState } from 'react';
import { db } from '../../db';
import TextEditor from '../../components/TextEditor';
import { useParams } from 'react-router-dom';

const NoteDetailsPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mountTextEditor, setMountTextEditor] = useState(false);
  const params = useParams();
  useEffect(() => {
    db.notes
      .where({ queryId: params.id })
      .first()
      .then((note) => {
        if (note) {
          setContent(note.content);
          setTitle(note.title);
          setMountTextEditor(true);
        }
      });
  }, []);
  return (
    <>
      <div>
        {mountTextEditor && (
          <TextEditor
            onSave={({ content, title }) => {
              db.notes.where({ queryId: params.id }).modify({
                content: content,
                title: title,
              });
            }}
            defaultContent={content as string}
            defaultTitle={title}
          />
        )}
      </div>
    </>
  );
};

export default NoteDetailsPage;
