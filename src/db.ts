import Dexie from 'dexie';

export class Database extends Dexie {
  notes!: Dexie.Table<Note, number>;

  constructor() {
    super('WriteSomethingDatabase');

    var db = this;

    //
    // Define tables and indexes
    //
    db.version(1).stores({
      notes:
        '++id, queryId, title, content, isPinned, createdAt, updatedAt, deletedAt',
    });

    // Let's physically map Note class to contacts table.
    // This will make it possible to call loadEmailsAndPhones()
    // directly on retrieved database objects.
    db.notes.mapToClass(Note);
  }
}

export interface NoteInterface {
  id?: number;
  queryId: string;
  title: string;
  content: any;
  isPinned: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}
/* This is a 'physical' class that is mapped to
 * the contacts table. We can have methods on it that
 * we could call on retrieved database objects.
 */
export class Note {
  id?: number;
  queryId: string;
  title: string;
  content: any;
  isPinned: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;

  constructor(
    title: string,
    queryId: string,
    id: number,
    content: any,
    isPinned: number,
    createdAt: number,
    updatedAt: number,
    deletedAt: number | null
  ) {
    this.title = title;
    this.queryId = queryId;
    this.content = content;
    this.isPinned = isPinned;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    if (id) this.id = id;
  }
}

export const db = new Database();
