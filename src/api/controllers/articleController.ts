import {NextFunction, Request, Response} from 'express';
import {Article, MessageResponse} from '../../types/LocalTypes';
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticle,
  updateArticle,
} from '../models/articleModel';
import CustomError from '../../classes/CustomError';

// GET /articles
const articlesGet = (
  req: Request,
  res: Response<Article[]>,
  next: NextFunction,
) => {
  try {
    const articles = getAllArticles();
    res.json(articles);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// GET /articles/:id
const articleGet = (
  req: Request<{id: string}>,
  res: Response<Article>,
  next: NextFunction,
) => {
  try {
    const article = getArticle(Number(req.params.id));
    if (!article) {
      next(new CustomError('No article found', 404));
      return;
    }
    res.json(article);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// POST /articles
const articlePost = (
  req: Request<unknown, unknown, Omit<Article, 'article_id'>>,
  res: Response<MessageResponse & {article: Article}>,
  next: NextFunction,
) => {
  try {
    const article = createArticle(req.body);
    if (!article) {
      next(new CustomError('Failed to create article', 500));
      return;
    }
    res.status(201).json({message: 'Article created successfully', article});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// PUT /articles/:id
const articlePut = (
  req: Request<{id: string}, unknown, Article>,
  res: Response<MessageResponse & {article: Article}>,
  next: NextFunction,
) => {
  try {
    const updatedArticle = updateArticle(
      Number(req.params.id),
      req.body.title,
      req.body.description,
    );
    res.json({
      message: 'Article updated successfully',
      article: updatedArticle,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// DELETE /articles/:id
const articleDelete = (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction,
) => {
  try {
    deleteArticle(Number(req.params.id));
    res.status(200).json({message: 'Article deleted successfully'});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {articlesGet, articleGet, articlePost, articlePut, articleDelete};
