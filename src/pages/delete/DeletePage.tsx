import { useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { useLiveQuery } from 'dexie-react-hooks';
import { Note, db } from '../../db';
import Header from './Header';
import Notes from './Notes';

const DeletePage = () => {
  const [query, setQuery] = useState('');
  let selectedCheckbox: Note[] = [];
  const queryDebounceValue = useDebounce(query, 500);
  const [showSelectedCheckbox, setShowSelectedCheckbox] = useState<{
    active: boolean;
    usedBy: 'restore' | 'delete-permanent' | 'none';
  }>({
    active: false,
    usedBy: 'none',
  });

  const notes = useLiveQuery(
    () =>
      db.notes
        .where('deletedAt')
        .notEqual(0)
        .filter(function (note) {
          return note.title.includes(query) || note.content.includes(query);
        })
        .toArray(),
    [queryDebounceValue] // because maxAge affects query!
  );

  if (!notes) return <></>;
  return (
    <div className="w-11/12 m-auto">
      <Header
        query={query}
        setQuery={setQuery}
        selectedCheckbox={selectedCheckbox}
        showSelectedCheckbox={showSelectedCheckbox}
        setShowSelectedCheckbox={setShowSelectedCheckbox}
      />
      <Notes
        notes={notes}
        selectedCheckbox={selectedCheckbox}
        showSelectedCheckbox={showSelectedCheckbox}
      />
    </div>
  );
};

export default DeletePage;
