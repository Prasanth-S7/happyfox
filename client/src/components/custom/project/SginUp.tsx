import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/config/config";

const ProjectsSignUp = () => {
    const [githubUsername, setGithubUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUsernameChange = (e) => {
        setGithubUsername(e.target.value);
        setError("");
    };

    const handleSubmit = async () => {
        if (!githubUsername.trim()) {
            setError("GitHub username is required");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await axios.patch(import.meta.env.VITE_BACKEND_BASE_URL+'api/v1/user', { githubUsername }, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });

            window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&scope=admin:repo_hook,repo,user:email`;
        } catch (err) {
            console.error("Error updating GitHub username:", err);
            setError(err.response?.data?.message || "Failed to update GitHub username");
            setIsLoading(false);
        }
    };
    
    return (
        <div className="h-full">
            <div className="w-[288px] h-[800px] flex justify-center items-center drop-shadow-md">
                <div className="text-center w-[288px] h-[200px] flex flex-col items-center justify-center space-y-4 bg-white rounded-md">
                    <p>Link your GitHub to get started</p>
                    <Input 
                        name="githubUserName" 
                        placeholder="GitHub Username" 
                        value={githubUsername}
                        onChange={handleUsernameChange}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isLoading || !githubUsername.trim()}
                    >
                        {isLoading ? "Processing..." : "Link GitHub"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProjectsSignUp;