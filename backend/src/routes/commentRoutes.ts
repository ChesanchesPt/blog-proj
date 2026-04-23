import { Router } from "express"
import { authenticateToken } from '../middlewares/auth'
import {
    getCommentsByPost,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
} from '../controllers/commentController'

const router = Router()

router.get('/posts/:postId/comments', getCommentsByPost);
router.get('/comments/:id', getCommentById);
router.post('/comments', authenticateToken, createComment);
router.put('/comments/:id', authenticateToken, updateComment);
router.delete('/comments/:id', authenticateToken, deleteComment);

export default router