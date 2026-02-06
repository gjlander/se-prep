import { Types } from 'mongoose';
type WithId = { _id: Types.ObjectId } & object;

export const normalizeId = (doc: WithId) => {
  const { _id, ...rest } = doc;
  const docDto = { id: _id, ...rest };
  return docDto;
};
