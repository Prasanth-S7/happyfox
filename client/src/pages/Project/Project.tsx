import ProjectsSignUp from "@/components/custom/project/SginUp";
import { useEffect, useState } from "react";
import axios from "axios";
import ProjectDis from "./ProjectList";

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
                setUserData(data.data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserdetails();
    }, []);

    return (
        <div className="h-full flex justify-center bg-black min-h-[calc(100vh-105px)]">
            {
                userData.githubAccessToken?
                <ProjectDis />
                :
                <ProjectsSignUp />
            }
        </div>
    )
}


export default ProjectPage;