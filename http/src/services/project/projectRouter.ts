import { Router } from "express";
import { userGithubDetails } from "./user";

const projectRouter = Router();

projectRouter.get('/user', userGithubDetails);

export default projectRouter;