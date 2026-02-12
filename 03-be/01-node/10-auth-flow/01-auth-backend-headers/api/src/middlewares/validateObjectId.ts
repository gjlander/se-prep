import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
const validateObjectId: RequestHandler = (req, _res, next) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  next();
};

export default validateObjectId;
