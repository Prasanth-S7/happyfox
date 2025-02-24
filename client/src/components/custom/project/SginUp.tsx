import { Button } from "@/components/ui/button";

const ProjectsSignUp = () => {
    
    return(
        <div className="h-full">
            <div className="w-[288px] h-[800px] flex justify-center items-center drop-shadow-md">
                <div className="text-center w-[288px] h-[200px] flex flex-col items-center justify-center space-y-4 bg-white rounded-md">
                    <p>Link your github to get started</p>
                    <a href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&scope=admin:repo_hook,repo,user`}>
                        <Button>
                            Link Github
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ProjectsSignUp;