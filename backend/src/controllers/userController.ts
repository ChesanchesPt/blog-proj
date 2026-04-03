import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg'
import { hashPassword } from "../utils/hashPassword";
import { error } from "node:console";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})
const prisma = new PrismaClient({adapter});

// GET /users список всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) =>
{
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true
            },
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// GET /users/:id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                username: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return
        }
        res.json(user);
    } catch (error) {
        next(error)
    }
}

// POST /users
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, isAdmin = false } = req.body

        if (!username || !password) {
            res.status(400).json({error: 'Missing required fields: username, password'})
            return
        }

        const existingUser = await prisma.user.findFirst({
            where: {username}
        })
        if (existingUser) {
            res.status(409).json({error: 'Username already exists'})
            return
        }

        const hashedPassword = await hashPassword(password)
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                isAdmin,
            },
            select: {
                id: true,
                username: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true
            }
        })
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

// PUT /users/:id
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { username, password, isAdmin } = req.body

        const dataToUpdate: any = {}
        if (username !== undefined) dataToUpdate.username = username
        if (password !== undefined) dataToUpdate.password = await hashPassword(password)
        if (isAdmin !== isAdmin) dataToUpdate.isAdmin = isAdmin

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: dataToUpdate,
            select: {
                id: true,
                username: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true
            }
        })
        res.json(updateUser)
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'User not found'})
        } else {
            next(error)
        }
    }
}

// DELETE /users/:id
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        await prisma.user.delete({
            where: { id: Number(id) },
        })
        res.status(204).send()
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'User not found'})
        } else {
            next(error)
        }
    }
}
