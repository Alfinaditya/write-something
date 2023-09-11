import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CancelIcon, NotesIcon, RotateIcon, TrashIcon } from '../../icons';
import { Note, db } from '../../db';

interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowSelectedCheckbox: React.Dispatch<
    React.SetStateAction<{
      active: boolean;
      usedBy: 'restore' | 'delete-permanent' | 'none';
    }>
  >;
  showSelectedCheckbox: {
    active: boolean;
    usedBy: 'restore' | 'delete-permanent' | 'none';
  };
  selectedCheckbox: Note[];
}

const Header: React.FC<Props> = ({
  query,
  setQuery,
  showSelectedCheckbox,
  selectedCheckbox,
  setShowSelectedCheckbox,
}) => {
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
  return (
    <>
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
      <div
        className={twMerge(
          'sm:flex sm:justify-end sm:flex-row',
          'sm:static',
          'mb-4',
          'fixed bottom-24 right-1',
          'flex flex-col'
        )}
      >
        {showSelectedCheckbox.active && (
          <button
            className={twMerge(
              'disabled:bg-slate-50 disabled:text-black',
              'bg-main',
              'hover:bg-blue-700',
              'text-white font-bold',
              'sm:py-2 px-4',
              'sm:mt-5',
              'sm:rounded',
              'p-3',
              'rounded-full',
              'mr-2 w-max'
            )}
            onClick={() =>
              setShowSelectedCheckbox({ active: false, usedBy: 'none' })
            }
          >
            <span className="sm:block hidden">Cancel</span>
            <CancelIcon className="sm:hidden block fill-white" />
          </button>
        )}
        {showRestore && (
          <button
            className={twMerge(
              'disabled:bg-slate-50 disabled:text-black',
              'bg-main',
              'hover:bg-blue-700',
              'text-white font-bold',
              'sm:py-2 px-4',
              'sm:rounded',
              'p-3',
              'rounded-full',
              'mr-2 mt-5 w-max'
            )}
            onClick={() => handleShowSelectedChekboxAndExecQuery('restore')}
          >
            <span className="sm:block hidden">Restore</span>
            <RotateIcon className="sm:hidden block fill-white" />
          </button>
        )}
        {showDelete && (
          <button
            className={twMerge(
              'disabled:bg-slate-50 disabled:text-black',
              'bg-main',
              'hover:bg-blue-700',
              'text-white font-bold',
              'sm:py-2 px-4',
              'sm:rounded',
              'p-3',
              'rounded-full',
              'mr-2 mt-5 w-max'
            )}
            onClick={() =>
              handleShowSelectedChekboxAndExecQuery('delete-permanent')
            }
          >
            <span className="sm:block hidden">Delete Permanently</span>
            <TrashIcon className="sm:hidden block fill-white" />
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
