import { Router } from "express";
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
router.post('/comments', createComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

export default router