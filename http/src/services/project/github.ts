import { Request, Response } from "express";

const githubLogin = async (req: Request, res: Response) => {
    try {
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=admin:repo_hook,repo,user`;
        res.redirect(githubUrl);
    } catch (error) {
        console.error(error);
        return null
    }
}



export {
    githubLogin,
}