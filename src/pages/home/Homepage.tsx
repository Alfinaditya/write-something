import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { useNavigate } from 'react-router-dom';
import { PinIcon, TrashIcon, NotesIcon, PlusIcon } from '../../icons';
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
    <div className="w-11/12 m-auto">
      <div className="flex items-center">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full mb-4">
          <div
            className={twMerge(
              'absolute inset-y-0 left-0',
              'flex items-center',
              'pl-3',
              'pointer-events-none'
            )}
          >
            <NotesIcon className="fill-main" />
          </div>
          <input
            type="text"
            id="simple-search"
            className={twMerge(
              'bg-gray-50 placeholder-gray-400 ',
              'focus:ring-blue-500 focus:border-blue-500',
              'border border-gray-600 rounded-lg',
              'text-sm text-black',
              'block',
              'w-full',
              'p-2.5 pl-10'
            )}
            placeholder="Search note..."
            required
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </div>
      </div>
      <div className={twMerge('w-full', 'sm:justify-end sm:flex', 'hidden')}>
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
          className={twMerge(
            'text-white font-medium text-sm',
            'focus:ring-4 focus:outline-none focus:ring-main',
            'rounded-full',
            'p-3 mr-2 mb-2',
            'bg-main'
          )}
        >
          <PlusIcon className="fill-white" />
        </button>
      </div>
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
        className={twMerge(
          'text-white font-medium text-sm ',
          'focus:ring-4 focus:outline-none focus:ring-main',
          'rounded-full',
          'p-3 mr-2 mb-2',
          'bg-main',
          'fixed right-1 bottom-24',
          'sm:hidden block'
        )}
      >
        <PlusIcon className="fill-white" />
      </button>
      <h1 className="my-4 text-lg font-bold">Pinned</h1>
      <div className="flex gap-2 flex-wrap">
        {notes
          .filter((note) => note.isPinned)
          .map((note) => (
            <div
              key={crypto.randomUUID()}
              className={twMerge(
                'rounded-lg border',
                'sm:w-max sm:h-max',
                'w-full h-44',
                'bg-yellow-50',
                'mb-4',
                'truncate ...'
              )}
            >
              <div
                onClick={() => navigate(`/note/${note.queryId}`)}
                key={note.queryId}
                className={twMerge(
                  'sm:w-[247px] sm:h-[388px]',
                  'w-full h-4/5',
                  'p-5',
                  'cursor-pointer'
                )}
              >
                <h1>{note.title}</h1>
                <Parser content={note.content} />
              </div>
              <div className={twMerge('flex justify-end gap-2', 'p-2')}>
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
      </div>
      <h1 className="my-4 text-lg font-bold">Others</h1>
      <div className="flex gap-2 flex-wrap">
        {notes
          .filter((note) => !note.isPinned)
          .map((note) => (
            <div
              key={crypto.randomUUID()}
              className={twMerge(
                'rounded-lg border',
                'sm:w-max sm:h-max',
                'w-full h-44',
                'mb-4',
                'truncate ...'
              )}
            >
              <div
                onClick={() => navigate(`/note/${note.queryId}`)}
                key={note.queryId}
                className={twMerge(
                  'sm:w-[247px] sm:h-[388px]',
                  'w-full h-4/5',
                  'p-5',
                  'cursor-pointer'
                )}
              >
                <h1>{note.title}</h1>
                <Parser content={note.content} />
              </div>
              <div className={twMerge('flex justify-end gap-2', 'p-2')}>
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
      </div>
    </div>
  );
};

export default Homepage;
