import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg'
import { AuthRequest } from "../middlewares/auth"


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})
const prisma = new PrismaClient({adapter});

// GET getCommentsByPost
export const getCommentsByPost = async (req: AuthRequest, res: Response, next: NextFunction) =>
{
    try {
        const { postId } = req.params
        const post = await prisma.post.findUnique({ where: {id: Number(postId)}})

        if (!post) {
            res.status(404).json({error: 'Post not found'})
            return
        }
        const comments = await prisma.comment.findMany({
            where: {postId: Number(postId)},
            include: {author: {select: {id: true, username: true}}},
            orderBy: { createdAt: 'asc'}
        })
        res.json(comments)
    } catch (error) {
        next(error)
    }
}

// GET getCommentById
export const getCommentById = async (req: AuthRequest, res: Response, next: NextFunction) =>
{
    try {
        const {id} = req.params
        const comment = await prisma.comment.findUnique({
            where: {id: Number(id)},
            include: {
                author: {select: {id: true, username: true}},
                post: { select: {id: true, title: true}}
            }
        })
        if (!comment) {
            res.status(404).json({error: 'Comment not found'})
            return
        } 
        res.json(comment)
    } catch (error) {
        next(error)
    }
}

// POST createComment
export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) =>
{
    try {
        const {text, postId} = req.body
        const authorId = req.user!.id
        if (!text || !authorId || !postId) {
            res.status(400).json({ error: 'Missing required fields: text, authorId, postId'})
        }

        const author = await prisma.user.findUnique({where: {id: Number(authorId)}})
        if (!author) {
            res.status(404).json({ error: 'Author not found'})
            return
        }

        const post = await prisma.post.findUnique({where: {id: Number(postId)}})
        if (!post) {
            res.status(404).json({ error: 'Post not found'})
            return
        }

        const newComment = await prisma.comment.create({
            data: {
                text,
                authorId: Number(authorId),
                postId: Number(postId)
            },
            include: {
                author: {select: {id: true, username: true}},
                post: {select: {id: true, title: true}}
            }
        })
        res.status(201).json(newComment)
    } catch (error) {
        next(error)
    }
}

// PUT updateComment
export const updateComment = async (req: AuthRequest, res: Response, next: NextFunction) =>
{
    try {
        const {id} = req.params
        const {text} = req.body
        const comment = await prisma.comment.findUnique({where: {id: Number(id)}})

        if (!comment){
            res.status(404).json({error: 'Comment not found'})
            return
        }

        if (comment.authorId !== req.user!.id && !req.user!.isAdmin) {
            res.status(403).json({error: 'Forbidden'})
            return
        }

        const update = await prisma.comment.update({
            where: {id: Number(id)},
            data: {text},
            include: {author: {select: {id: true, username: true}}}
        })
        res.json(update)
    } catch (error) {
        next(error)
    }
}

// DELETE deleteComment
export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction) =>
{
    try {
        const {id} = req.params
        const comment = await prisma.comment.findUnique({where: {id: Number(id)}})

        if (!comment) {
            res.status(404).json({error: 'Comment not found'})
            return
        }

        if (comment.authorId !== req.user!.id && !req.user!.isAdmin) {
            res.status(403).json({error: 'Forbidden'})
            return
        }

        await prisma.comment.delete({where: {id: Number(id)}})
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}