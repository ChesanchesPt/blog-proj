import { Router } from "express";
import { 
    upvoteComment,
    downvoteComment,
    upvotePost,
    downvotePost,
} from '../controllers/voteController';

const router = Router()

router.post('/posts/:id/upvote', upvotePost);
router.post('/posts/:id/downvote', downvotePost);


router.post('/comments/:id/upvote', upvoteComment);
router.post('/comments/:id/downvote', downvoteComment);

export default router