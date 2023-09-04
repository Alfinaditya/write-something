import { useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { useLiveQuery } from 'dexie-react-hooks';
import { NoteInterface, db } from '../../db';
import { twMerge } from 'tailwind-merge';
import Parser from '../../components/Parser';
import { CheckIcon } from '../../icons';
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
  if (!notes) return <></>;
  return (
    <div>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        type="text"
        placeholder="Username"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      {showSelectedCheckbox.active && (
        <button
          className="disabled:bg-slate-50 disabled:text-black bg-main hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() =>
            setShowSelectedCheckbox({ active: false, usedBy: 'none' })
          }
        >
          Cancel
        </button>
      )}
      <button
        className="disabled:bg-slate-50 disabled:text-black bg-main hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={
          showSelectedCheckbox.active &&
          showSelectedCheckbox.usedBy !== 'restore'
        }
        onClick={() => handleShowSelectedChekboxAndExecQuery('restore')}
      >
        Restore
      </button>
      <button
        className="disabled:bg-slate-50 disabled:text-black bg-main hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={
          showSelectedCheckbox.active &&
          showSelectedCheckbox.usedBy !== 'delete-permanent'
        }
        onClick={() =>
          handleShowSelectedChekboxAndExecQuery('delete-permanent')
        }
      >
        Delete Permanently
      </button>
      {notes.map((note) => (
        <div
          key={crypto.randomUUID()}
          className={twMerge('rounded-lg', 'bg-blue-500', 'max-w-max')}
        >
          {showSelectedCheckbox.active && (
            <div className="flex items-center">
              <Checkbox.Root
                className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]"
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
                Delete
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
            <h1
            // className={twMerge(
            //   query && note.title.includes(query) ? 'bg-yellow-500' : ''
            // )}
            >
              {note.title}
            </h1>
            <Parser content={note.content} />
          </div>
          {/* <div className="flex justify-end p-2 gap-2">
            <PinIcon
              onClick={() =>
                db.notes
                  .where({ queryId: note.queryId })
                  .modify({ isPinned: 0 })
              }
              className="fill-main cursor-pointer"
            />
            <TrashIcon className="fill-main" />
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default DeletePage;
