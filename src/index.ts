import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
});

app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const posts = await prisma.post.findMany({
    where: { id: Number(id), published: true },
  });

  if (posts.length) {
    return res.json(posts[0]);
  }

  return res.status(404).json({ message: 'Post not found' });
});

app.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });
  res.json(result);
});

app.post(`/post`, async (req, res) => {
  const { title, content, authorId } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      authorId,
    },
  });
  res.json(result);
});

app.patch('/post/publish/:id', async (req, res) => {
  const { id } = req.params;

  const postExists = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (postExists) {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { published: true },
    });

    return res.json(post);
  }

  return res.status(404).json({ message: 'Post not found' });
});

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;

  const postExists = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (postExists) {
    await prisma.post.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Post deleted' });
  }

  return res.status(404).json({ message: 'Post not found' });
});

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000')
);
