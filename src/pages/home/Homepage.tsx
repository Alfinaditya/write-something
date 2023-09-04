import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { useNavigate } from 'react-router-dom';
import { PinIcon, TrashIcon } from '../../icons';
import Parser from '../../components/Parser';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

const Homepage = () => {
  // const notes = useLiveQuery(() => db.notes.toArray());
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
  const navigate = useNavigate();
  // const [title, setTitle] = useState('');
  useEffect(() => {
    db.notes
      .filter(function (note) {
        return note.title.includes(query);
      })
      .toArray()
      .then(function (result) {
        console.log(
          'Found ' +
            result.length +
            " friends containing the word 'Bar' in its name..."
        );
      });
  }, [queryDebounceValue]);

  if (!notes) return <></>;
  return (
    <>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder="Username"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <button
        onClick={() => {
          const uuid = crypto.randomUUID();
          db.notes.add({
            queryId: uuid,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            content: '',
            deletedAt: 0,
            isPinned: 0,
            title: '',
          });
          navigate(`/note/${uuid}`);
        }}
      >
        Add Notes
      </button>
      <h1>Pinned</h1>
      {notes
        .filter((note) => note.isPinned)
        .map((note) => (
          <div
            key={crypto.randomUUID()}
            className={twMerge('rounded-lg', 'bg-blue-500', 'max-w-max')}
          >
            <div
              onClick={() => navigate(`/note/${note.queryId}`)}
              key={note.queryId}
              className={twMerge(
                'truncate ...',
                'w-[247px] h-[388px]',
                'p-5',
                'cursor-pointer'
              )}
            >
              <h1
              // className={twMerge(
              //   query && note.title.includes(query) ? 'bg-yellow-500' : ''
              // )}
              >
                {note.title}
              </h1>
              <Parser content={note.content} />
            </div>
            <div className="flex justify-end p-2 gap-2">
              <PinIcon
                onClick={() =>
                  db.notes
                    .where({ queryId: note.queryId })
                    .modify({ isPinned: 0 })
                }
                className="fill-main cursor-pointer"
              />
              <TrashIcon
                onClick={() =>
                  db.notes
                    .where({ queryId: note.queryId })
                    .modify({ deletedAt: Date.now() })
                }
                className="fill-main cursor-pointer"
              />
            </div>
          </div>
        ))}
      <h1>Others</h1>
      <div className="flex gap-2">
        {notes
          .filter((note) => !note.isPinned)
          .map((note) => (
            <div
              key={crypto.randomUUID()}
              className={twMerge('rounded-lg', 'bg-blue-500', 'max-w-max')}
            >
              <div
                onClick={() => navigate(`/note/${note.queryId}`)}
                key={note.queryId}
                className={twMerge(
                  'truncate ...',
                  'w-[247px] h-[388px]',
                  'p-5',
                  'cursor-pointer'
                )}
              >
                <h1>{note.title}</h1>
                <Parser content={note.content} />
              </div>
              <div className="flex justify-end p-2 gap-2">
                <PinIcon
                  onClick={() =>
                    db.notes
                      .where({ queryId: note.queryId })
                      .modify({ isPinned: 1 })
                  }
                  className="fill-main cursor-pointer rotate-45"
                />
                <TrashIcon
                  onClick={() =>
                    db.notes
                      .where({ queryId: note.queryId })
                      .modify({ deletedAt: Date.now() })
                  }
                  className="fill-main cursor-pointer"
                />
              </div>
            </div>
          ))}
        {/* {notes.filter((note) => (
          <div className={twMerge('rounded-lg', 'bg-blue-500', 'max-w-max')}>
            <div
              onClick={() => navigate(`/note/${note.queryId}`)}
              key={note.queryId}
              className={twMerge(
                'truncate ...',
                'w-[247px] h-[388px]',
                'p-5',
                'cursor-pointer'
              )}
            >
              <h1>{note.title}</h1>
              <Parser content={note.content} />
            </div>
            <div className="flex justify-end p-2 gap-2">
              <PinIcon onClick={() => alert('rock')} className="fill-main" />
              <TrashIcon className="fill-main" />
            </div>
          </div>
        ))} */}
      </div>
    </>
  );
};

export default Homepage;
