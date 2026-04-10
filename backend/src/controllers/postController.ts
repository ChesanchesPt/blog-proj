import { Request, Response, NextFunction } from "express"
import { PrismaClient } from '@prisma/client'
import {PrismaPg} from '@prisma/adapter-pg'
import { AuthRequest } from "../middlewares/auth"


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({adapter});

// GET getPosts
export const getPosts = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
        const { authorId } = req.query
        const where = authorId ? { authorId: Number(authorId) } : {}
        const posts = await prisma.post.findMany({
            where,
            include: {
                author:{
                    select: { id: true, username: true, isAdmin: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(posts)
    } catch (error) {
        next(error)
    }
}

// GET getPostById
export const getPostById = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
        const {id} = req.params
        const post = await prisma.post.findUnique({
            where: {id: Number(id)},
            include: {
                author: {
                    select: {id:true, username:true}
                },
                comments: {
                    include:{author:{select:{id:true, username:true}}},
                    orderBy: {createdAt: 'asc'}
                }
            }
        })
        if (!post) {
            res.status(404).json({error: 'Post not found'})
            return
        }
        res.json(post)
    } catch (error) {
        next(error)
    }
}

// POST createPost
export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) =>
{
    try {
        const {title, description, imageUrl} = req.body
        const authorId = req.user!.id

        if (!title) {
            res.status(400).json({ error: 'Title required'})
            return
        }

        const newPost = await prisma.post.create({
            data: {title, description, imageUrl, authorId},
            include: {author: {select: {id: true, username: true}}}
        })
        res.status(201).json(newPost)
    } catch (error) {
        next(error)
    }
}

// PUT updatePost
export const updatePost = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
        const {id} = req.params
        const {title, description, imageUrl} = req.body
        const existingPost = await prisma.post.findUnique({ where: {id: Number(id)}})

        if (!existingPost) {
            res.status(404).json({error: 'Post not found'})
            return
        }

        const updatedPost = await prisma.post.update({
            where: {id: Number(id)},
            data: {title, description, imageUrl},
            include: {author: {select: {id: true, username: true}}}
        })
        res.json(updatedPost)
    } catch (error) {
        next(error)
    }
}

// DELETE deletePost
export const deletePost = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
        const {id} = req.params
        const existingPost = await prisma.post.findUnique({where: {id: Number(id)}})

        if (!existingPost) {
            res.status(404).json({error: 'Post not found'})
            return
        }

        await prisma.post.delete({where: {id: Number(id)}})
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
