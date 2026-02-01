import Database from 'better-sqlite3';
import {checkData, checkAuthors, exampleData, exampleAuthors, filename, tables, authors} from './db-config';

const db = new Database(filename);
db.pragma('journal_mode = WAL');

// init tables, use exec only for CREATE TABLE
db.exec(tables);
db.exec(authors);

// Check if the authors table is empty
const authorCount = (db.prepare(checkAuthors).get() as {count: number}).count;
// If the table is empty, insert example data
if (authorCount === 0) {
  db.prepare(exampleAuthors).run();
  console.log('Inserted example data.');
} else {
  console.log('Authors table already populated.');
}

// Check if the articles table is empty
const rowCount = (db.prepare(checkData).get() as {count: number}).count;
// If the table is empty, insert example data
if (rowCount === 0) {
  db.prepare(exampleData).run();
  console.log('Inserted example data.');
} else {
  console.log('Table already populated.');
}

export default db;
