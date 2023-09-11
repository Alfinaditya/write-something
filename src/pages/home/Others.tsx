import React from 'react';
import { Note, db } from '../../db';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import Parser from '../../components/Parser';
import { PinIcon, TrashIcon } from '../../icons';

interface Props {
  notes: Note[];
}

const Others: React.FC<Props> = ({ notes }) => {
  const navigate = useNavigate();
  return (
    <>
      {notes.length > 0 && (
        <>
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
        </>
      )}
    </>
  );
};

export default Others;
