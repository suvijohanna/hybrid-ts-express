import {NextFunction, Request, Response} from 'express';
import {Author, MessageResponse} from '../../types/LocalTypes';
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthor,
  updateAuthor,
} from '../models/authorModel';
import CustomError from '../../classes/CustomError';

const authorsGet = (
  req: Request,
  res: Response<Author[]>,
  next: NextFunction,
) => {
  try {
    const authors = getAllAuthors();
    res.json(authors);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const authorGet = (
  req: Request<{id: string}>,
  res: Response<Author>,
  next: NextFunction,
) => {
  try {
    const {id} = req.params;
    const author = getAuthor(Number(id));
    if (!author) {
      next(new CustomError('No author found', 404));
      return;
    }
    res.json(author);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const authorPost = (
  req: Request<unknown, unknown, Omit<Author, 'author_id'>>,
  res: Response<MessageResponse & {author: Author}>,
  next: NextFunction,
) => {
  try {
    const author = createAuthor(req.body);
    if (!author) {
      next(new CustomError('Failed to create author', 500));
    }
    res.status(201).json({message: 'Author created successfully', author});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const authorPut = (
  req: Request<{id: string}, unknown, Author>,
  res: Response<Author>,
  next: NextFunction,
) => {
  try {
    const author = updateAuthor(
      Number(req.params.id),
      req.body.name,
      req.body.email,
    );
    res.json(author);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const authorDelete = (
  req: Request<{id: string}>,
  res: Response<unknown>,
  next: NextFunction,
) => {
  try {
    deleteAuthor(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {authorsGet, authorGet, authorPost, authorPut, authorDelete};
