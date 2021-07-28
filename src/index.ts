import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// ... your REST API routes will go here

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000')
);
