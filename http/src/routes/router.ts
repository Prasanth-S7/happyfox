import { Router } from "express";
import { userRouter } from "./user";
import { chatRouter } from "./chat";
import { forumRouter } from "./forum";
import eventRouter from "./event/event";
import { postRouter } from "./post";
<<<<<<< HEAD
import { resourceRouter } from "./resource";
=======
import projectRouter from "../services/project/projectRouter";
>>>>>>> 1d539d30f7461b29080d3cc9313626178d6c75ce

const router = Router();

router.use('/user', userRouter);
router.use('/chat', chatRouter);
router.use('/forum', forumRouter);
router.use('/event', eventRouter);
router.use('/post', postRouter);
<<<<<<< HEAD
router.use('/resource', resourceRouter); 
=======
router.use('/github', projectRouter);
>>>>>>> 1d539d30f7461b29080d3cc9313626178d6c75ce

export default router;