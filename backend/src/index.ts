import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'
import commentRoutes from './routes/commentRoutes'
import voteRoutes from './routes/voteRoutes'
import authRoutes from './routes/authRoutes'

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/', commentRoutes)
app.use('/', voteRoutes)
app.use('/auth', authRoutes)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});