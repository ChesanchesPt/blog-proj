import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg'
import { AuthRequest } from "../middlewares/auth"


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})
const prisma = new PrismaClient({adapter})


// Posts
export const upvotePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const postId = Number(id)

    // Проверка существования поста
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      res.status(404).json({ error: 'Post not found' })
      return;
    }

    // Транзакция
    const result = await prisma.$transaction(async (tx) => {
      const existingVote = await tx.vote.findUnique({
        where: { userId_postId: { userId, postId } },
      })

      if (!existingVote) {
        // создаём upvote
        await tx.vote.create({
          data: { userId, postId, value: 1 },
        });
        await tx.post.update({
          where: { id: postId },
          data: { points: { increment: 1 } },
        });
        return { action: 'upvoted', delta: 1 }
      }

      if (existingVote.value === 1) {
        // Уже upvote удаляем
        await tx.vote.delete({ where: { id: existingVote.id } })
        await tx.post.update({
          where: { id: postId },
          data: { points: { decrement: 1 } },
        });
        return { action: 'unvoted', delta: -1 }
      }

      // downvote > upvote
      await tx.vote.update({
        where: { id: existingVote.id },
        data: { value: 1 },
      })
      await tx.post.update({
        where: { id: postId },
        data: { points: { increment: 2 } }, // -1 -> +1 = разница +2
      })
      return { action: 'changed_to_upvote', delta: 2 }
    })

    res.json({ message: `Post ${result.action}`, pointsDelta: result.delta })
  } catch (error) {
    next(error)
  }
};

export const downvotePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const postId = Number(id)

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      res.status(404).json({ error: 'Post not found' })
      return
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingVote = await tx.vote.findUnique({
        where: { userId_postId: { userId, postId } },
      })

      if (!existingVote) {
        await tx.vote.create({
          data: { userId, postId, value: -1 },
        })
        await tx.post.update({
          where: { id: postId },
          data: { points: { decrement: 1 } },
        })
        return { action: 'downvoted', delta: -1 }
      }

      if (existingVote.value === -1) {
        // Уже downvote удаляем
        await tx.vote.delete({ where: { id: existingVote.id } })
        await tx.post.update({
          where: { id: postId },
          data: { points: { increment: 1 } },
        })
        return { action: 'unvoted', delta: 1 }
      }

      // upvote > downvote
      await tx.vote.update({
        where: { id: existingVote.id },
        data: { value: -1 },
      })
      await tx.post.update({
        where: { id: postId },
        data: { points: { decrement: 2 } }, // +1 -> -1 = разница -2
      });
      return { action: 'changed_to_downvote', delta: -2 }
    })

    res.json({ message: `Post ${result.action}`, pointsDelta: result.delta })
  } catch (error) {
    next(error)
  }
};


// Comments
export const upvoteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const commentId = Number(id)

    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' })
      return
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingVote = await tx.vote.findUnique({
        where: { userId_commentId: { userId, commentId } },
      })

      if (!existingVote) {
        await tx.vote.create({
          data: { userId, commentId, value: 1 },
        })
        await tx.comment.update({
          where: { id: commentId },
          data: { points: { increment: 1 } },
        })
        return { action: 'upvoted', delta: 1 }
      }

      if (existingVote.value === 1) {
        await tx.vote.delete({ where: { id: existingVote.id } })
        await tx.comment.update({
          where: { id: commentId },
          data: { points: { decrement: 1 } },
        })
        return { action: 'unvoted', delta: -1 }
      }

      // downvote > upvote
      await tx.vote.update({
        where: { id: existingVote.id },
        data: { value: 1 },
      })
      await tx.comment.update({
        where: { id: commentId },
        data: { points: { increment: 2 } },
      })
      return { action: 'changed_to_upvote', delta: 2 }
    })

    res.json({ message: `Comment ${result.action}`, pointsDelta: result.delta })
  } catch (error) {
    next(error)
  }
}

export const downvoteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const commentId = Number(id)

    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingVote = await tx.vote.findUnique({
        where: { userId_commentId: { userId, commentId } },
      })

      if (!existingVote) {
        await tx.vote.create({
          data: { userId, commentId, value: -1 },
        })
        await tx.comment.update({
          where: { id: commentId },
          data: { points: { decrement: 1 } },
        })
        return { action: 'downvoted', delta: -1 }
      }

      if (existingVote.value === -1) {
        await tx.vote.delete({ where: { id: existingVote.id } })
        await tx.comment.update({
          where: { id: commentId },
          data: { points: { increment: 1 } },
        })
        return { action: 'unvoted', delta: 1 }
      }

      // upvote > downvote
      await tx.vote.update({
        where: { id: existingVote.id },
        data: { value: -1 },
      })
      await tx.comment.update({
        where: { id: commentId },
        data: { points: { decrement: 2 } },
      })
      return { action: 'changed_to_downvote', delta: -2 };
    })

    res.json({ message: `Comment ${result.action}`, pointsDelta: result.delta })
  } catch (error) {
    next(error)
  }
}
