import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from '../config'


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})
const prisma = new PrismaClient({adapter})

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' })
      return
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const secret = config.jwtSecret
    if (!secret) {
        throw new Error("JWT_SECRET is not defined")
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      secret,
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } })
  } catch (error) {
    next(error)
  }
}