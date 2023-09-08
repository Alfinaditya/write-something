import { useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { useLiveQuery } from 'dexie-react-hooks';
import { NoteInterface, db } from '../../db';
import { twMerge } from 'tailwind-merge';
import Parser from '../../components/Parser';
import {
  CheckIcon,
  NotesIcon,
  RotateIcon,
  TrashIcon,
  XIcon,
} from '../../icons';
import * as Checkbox from '@radix-ui/react-checkbox';

const DeletePage = () => {
  const [query, setQuery] = useState('');
  let selectedCheckbox: NoteInterface[] = [];
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
  function handleDeletePermanent() {
    selectedCheckbox.map((selected) =>
      db.notes.where({ queryId: selected.queryId }).delete()
    );
  }
  function handleRestore() {
    selectedCheckbox.map((selected) =>
      db.notes.where({ queryId: selected.queryId }).modify({ deletedAt: 0 })
    );
  }
  function handleShowSelectedChekboxAndExecQuery(
    usedBy: 'restore' | 'delete-permanent' | 'none'
  ) {
    if (
      !showSelectedCheckbox.active &&
      showSelectedCheckbox.usedBy === 'none'
    ) {
      if (usedBy === 'delete-permanent') {
        setShowSelectedCheckbox({
          active: true,
          usedBy: 'delete-permanent',
        });
        return;
      }
      setShowSelectedCheckbox({
        active: true,
        usedBy: 'restore',
      });
      return;
    }

    if (!selectedCheckbox.length) {
      return alert('Please at least selected 1 note');
    }

    if (
      showSelectedCheckbox.active &&
      showSelectedCheckbox.usedBy === 'delete-permanent'
    ) {
      handleDeletePermanent();
      setShowSelectedCheckbox({
        active: false,
        usedBy: 'none',
      });
      return;
    }
    if (
      showSelectedCheckbox.active &&
      showSelectedCheckbox.usedBy === 'restore'
    ) {
      handleRestore();
      setShowSelectedCheckbox({
        active: false,
        usedBy: 'none',
      });
      return;
    }
  }
  const showDelete =
    !showSelectedCheckbox.active ||
    showSelectedCheckbox.usedBy === 'delete-permanent';
  const showRestore =
    !showSelectedCheckbox.active || showSelectedCheckbox.usedBy === 'restore';

  if (!notes) return <></>;
  return (
    <div className="w-11/12 m-auto">
      <div className={twMerge('flex items-center', 'mb-4')}>
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
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
      {/* Desktop */}
      <div className={twMerge('hidden', 'sm:flex sm:justify-end', 'mb-4')}>
        {showSelectedCheckbox.active && (
          <button
            className={twMerge(
              'disabled:bg-slate-50 disabled:text-black',
              'bg-main',
              'hover:bg-blue-700',
              'text-white font-bold',
              'py-2 px-4',
              'rounded',
              'mr-2'
            )}
            onClick={() =>
              setShowSelectedCheckbox({ active: false, usedBy: 'none' })
            }
          >
            Cancel
          </button>
        )}
        {showRestore && (
          <button
            className={twMerge(
              'disabled:bg-slate-50 disabled:text-black',
              'bg-main',
              'hover:bg-blue-700',
              'text-white font-bold',
              'py-2 px-4',
              'rounded',
              'mr-2'
            )}
            onClick={() => handleShowSelectedChekboxAndExecQuery('restore')}
          >
            Restore
          </button>
        )}
        {showDelete && (
          <button
            className={twMerge(
              'disabled:bg-slate-50 disabled:text-black',
              'bg-main',
              'hover:bg-blue-700',
              'text-white font-bold',
              'py-2 px-4',
              'rounded'
            )}
            onClick={() =>
              handleShowSelectedChekboxAndExecQuery('delete-permanent')
            }
          >
            Delete Permanently
          </button>
        )}
      </div>
      {/* Desktop */}

      {/* Mobile */}
      <div className="sm:hidden fixed bottom-24 right-2">
        {showSelectedCheckbox.active && (
          <button
            onClick={() => {
              setShowSelectedCheckbox({ active: false, usedBy: 'none' });
            }}
            className={twMerge(
              'text-white font-medium text-sm',
              'focus:ring-4 focus:outline-none focus:ring-main',
              'rounded-full',
              'p-3',
              'bg-main',
              'sm:hidden block'
            )}
          >
            <XIcon className="fill-white" />
          </button>
        )}
        {showRestore && (
          <button
            className={twMerge(
              'text-white font-medium text-sm',
              'focus:ring-4 focus:outline-none focus:ring-main',
              'rounded-full',
              'p-3',
              'mt-5',
              'bg-main',
              'sm:hidden block'
            )}
            onClick={() => handleShowSelectedChekboxAndExecQuery('restore')}
          >
            <RotateIcon className="fill-white" />
          </button>
        )}
        {showDelete && (
          <button
            className={twMerge(
              'text-white font-medium text-sm',
              'focus:ring-4 focus:outline-none focus:ring-main',
              'rounded-full',
              'p-3',
              'mt-5',
              'bg-main',
              'sm:hidden block'
            )}
            onClick={() =>
              handleShowSelectedChekboxAndExecQuery('delete-permanent')
            }
          >
            <TrashIcon className="fill-white" />
          </button>
        )}
      </div>
      {/* Mobile */}

      <div className="flex gap-2 flex-wrap">
        {notes.map((note) => (
          <div
            key={crypto.randomUUID()}
            className={twMerge(
              'truncate ...',
              'sm:w-[247px] sm:h-[388px]',
              'w-full h-44',
              'rounded-lg border',
              'p-5',
              'cursor-pointer'
            )}
          >
            {showSelectedCheckbox.active && (
              <div className="flex items-center">
                <Checkbox.Root
                  className={twMerge(
                    'shadow-blackA7',
                    'hover:bg-violet3',
                    'focus:shadow-[0_0_0_2px_black]',
                    'flex',
                    'h-[25px] w-[25px]',
                    'appearance-none',
                    'items-center justify-center',
                    'rounded-[4px]',
                    'bg-white',
                    'shadow-[0_2px_10px]',
                    'outline-none'
                  )}
                  id="c1"
                  onCheckedChange={(con) => {
                    if (con) {
                      selectedCheckbox = [...selectedCheckbox, note];
                      return;
                    }
                    selectedCheckbox = selectedCheckbox.filter(
                      (selected) => selected.id !== note.id
                    );
                  }}
                >
                  <Checkbox.Indicator className="text-violet11">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  className="pl-[15px] text-[15px] leading-none text-white"
                  htmlFor="c1"
                >
                  {showSelectedCheckbox.active &&
                  showSelectedCheckbox.usedBy === 'delete-permanent'
                    ? 'Delete'
                    : 'Restore'}
                </label>
              </div>
            )}
            <div
              //   onClick={() => Navigate(`/note/${note.queryId}`)}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeletePage;
