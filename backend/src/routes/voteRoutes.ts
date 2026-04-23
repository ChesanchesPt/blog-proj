import { Router } from "express"
import { authenticateToken } from '../middlewares/auth'
import { 
    upvoteComment,
    downvoteComment,
    upvotePost,
    downvotePost,
} from '../controllers/voteController'

const router = Router()

router.post('/posts/:id/upvote', authenticateToken, upvotePost)
router.post('/posts/:id/downvote', authenticateToken, downvotePost)


router.post('/comments/:id/upvote', authenticateToken, upvoteComment)
router.post('/comments/:id/downvote', authenticateToken, downvoteComment)

export default router