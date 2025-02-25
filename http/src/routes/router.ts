import { Router } from "express";
import { userRouter } from "./user";
import { chatRouter } from "./chat";
import { forumRouter } from "./forum";
import eventRouter from "./event/event";
import { postRouter } from "./post";
import { resourceRouter } from "./resource";
import projectRouter from "../services/project/projectRouter";
import { sessionRouter } from "./session";

const router = Router();

router.use('/user', userRouter);
router.use('/chat', chatRouter);
router.use('/forum', forumRouter);
router.use('/event', eventRouter);
router.use('/post', postRouter);
router.use('/resource', resourceRouter); 
router.use('/session', sessionRouter);
router.use('/github', projectRouter);

export default router;