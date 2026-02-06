import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { Post } from '#models';
import { normalizeId } from '#utils';

export const getAllPosts: RequestHandler = async (_req, res) => {
  const posts = await Post.find().populate('author').lean();

  const postDtos = posts.map(post => normalizeId(post));
  res.json(postDtos);
};

export const createPost: RequestHandler = async (req, res) => {
  const newPost = await Post.create(req.body);
  const postDto = normalizeId(newPost);
  res.status(201).json(postDto);
};

export const getSinglePost: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: { status: 400 } });
  const post = await Post.findById(id).lean();
  if (!post) throw new Error(`Post with id of ${id} doesn't exist`, { cause: { status: 404 } });

  const postDto = normalizeId(post);
  res.json(postDto);
};

export const updatePost: RequestHandler = async (req, res) => {
  const {
    params: { id },
    body: { title, content, image },
    post
  } = req;

  if (!post) throw new Error(`Post with id of ${id} doesn't exist`, { cause: { status: 404 } });

  post.title = title;
  post.content = content;
  post.image = image;

  await post.save();

  const postDto = normalizeId(post);
  res.json(postDto);
};

export const deletePost: RequestHandler = async (req, res) => {
  const {
    params: { id },
    post
  } = req;

  if (!post) throw new Error(`Post with id of ${id} doesn't exist`, { cause: { status: 404 } });

  await Post.findByIdAndDelete(id);

  res.json({ success: `Post with id of ${id} was deleted` });
};
