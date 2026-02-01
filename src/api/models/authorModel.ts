import db from '../../database/db';
import {Author} from '../../types/LocalTypes';

const getAllAuthors = () => {
  return db.prepare<unknown[], Author>('SELECT * FROM authors').all();
};

const getAuthor = (id: number) => {
  const author = db
    .prepare<number, Author>('SELECT * FROM authors WHERE author_id = ?')
    .get(id);
  if (!author) {
    return null;
  }
  return author;
};

const createAuthor = (author: Omit<Author, 'author_id'>) => {
  const stmt = db
    .prepare('INSERT INTO authors (name, email) VALUES (?, ?)')
    .run(author.name, author.email);
  if (!stmt.lastInsertRowid) {
    throw new Error('Failed to insert author');
  }
  return getAuthor(Number(stmt.lastInsertRowid));
};

const updateAuthor = (id: number, name: string, email: string): Author => {
  const stmt = db
    .prepare('UPDATE authors SET name = ?, email = ? WHERE author_id = ?')
    .run(name, email, id);
  if (stmt.changes === 0) {
    throw new Error('Failed to update author');
  }
  return getAuthor(id)!;
};

const deleteAuthor = (id: number): void => {
  const deleteTransactions = db.transaction((id: number) => {
    db.prepare('DELETE FROM articles WHERE author = ?').run(id);
    const stmt = db.prepare('DELETE FROM authors WHERE author_id = ?').run(id);
    if (stmt.changes === 0) {
      throw new Error('Author not found');
    }
  });
  deleteTransactions(id);
};

export {getAllAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor};
