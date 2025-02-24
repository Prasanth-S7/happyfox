import { Router } from "express";
import { userRouter } from "./user";
import { chatRouter } from "./chat";
import { forumRouter } from "./forum";
import eventRouter from "./event/event";
import { postRouter } from "./post";

const router = Router();

router.use('/user', userRouter);
router.use('/chat', chatRouter);
router.use('/forum', forumRouter);
router.use('/event', eventRouter);
router.use('/post', postRouter);

export default router;