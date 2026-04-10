import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

export interface AuthRequest extends Request {
    user?: { id: number; username: string; isAdmin: boolean }
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        res.status(401).json({error: 'Access token required'})
        return
    }

    const secret = config.jwtSecret
    if (!secret) {
        throw new Error("JWT_SECRET is not defined")
    }

    try {
        const decoded = jwt.verify(token, secret) as { id: number; username: string; isAdmin: boolean }
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({error: 'Invalid or expired token'})
    }
}