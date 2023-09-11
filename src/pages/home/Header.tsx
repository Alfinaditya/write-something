import { twMerge } from 'tailwind-merge';
import { NotesIcon, PlusIcon } from '../../icons';
import { useNavigate } from 'react-router-dom';
import { db } from '../../db';
interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}
const Header: React.FC<Props> = ({ query, setQuery }) => {
  const navigate = useNavigate();
  return (
    <div>
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
            placeholder="Search Note..."
            required
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </div>
      </div>
      <div
        className={twMerge(
          'sm:w-full',
          'sm:justify-end sm:flex sm:flex-row',
          'sm:static',
          'fixed bottom-24 right-1',
          'flex flex-col'
        )}
      >
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
    </div>
  );
};

export default Header;
