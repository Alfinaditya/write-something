import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import Pinned from './Pinned';
import Others from './Others';
import Header from './Header';
import Empty from './Empty';

const Homepage = () => {
  const [query, setQuery] = useState('');
  const queryDebounceValue = useDebounce(query, 500);

  const notes = useLiveQuery(
    () =>
      db.notes
        .where({ deletedAt: 0 })
        .filter(function (note) {
          return note.title.includes(query) || note.content.includes(query);
        })
        .toArray(),
    [queryDebounceValue] // because maxAge affects query!
  );
  useEffect(() => {
    db.notes
      .filter(function (note) {
        return note.title.includes(query);
      })
      .toArray();
  }, [queryDebounceValue]);

  if (!notes) return <></>;
  return (
    <div className="w-11/12 m-auto">
      <Header query={query} setQuery={setQuery} />
      {!notes.length && <Empty />}
      <Pinned notes={notes} />
      <Others notes={notes} />
    </div>
  );
};

export default Homepage;
