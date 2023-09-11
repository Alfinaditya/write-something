import React from 'react';
import { Note } from '../../db';
import { twMerge } from 'tailwind-merge';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '../../icons';
import Parser from '../../components/Parser';

interface Props {
  notes: Note[];
  showSelectedCheckbox: {
    active: boolean;
    usedBy: 'restore' | 'delete-permanent' | 'none';
  };
  selectedCheckbox: Note[];
}

const Notes: React.FC<Props> = ({
  notes,
  showSelectedCheckbox,
  selectedCheckbox,
}) => {
  return (
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
  );
};

export default Notes;
