import ProjectsSignUp from "@/components/custom/project/SginUp";
import { useEffect, useState } from "react";
import axios from "axios";

const ProjectPage = () => {
    const [userData, setUserData] = useState({
        githubAccessToken: null,
        githubAvatarUrl: null,
        githubProfileUrl: null,
        githubUsername: null,
        projects: [],
        techStack: [],
    })
    const getUserdetails = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/v1/github/user', {
                withCredentials: true,
            });
            if (res.status == 200) {
                const data = res.data;
                setUserData(data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserdetails();
        console.log("after thid")
    }, []);

    return (
        <div className="h-full flex items-center justify-center">
            {
                userData.githubAccessToken?
                <p>User Signed in</p>
                :
                <ProjectsSignUp />
            }
        </div>
    )
}


export default ProjectPage;