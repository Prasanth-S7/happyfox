import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Loader2 } from "lucide-react";
import axios from "axios";
import Cookies from 'js-cookie';
import { EyeIcon } from 'lucide-react';

const BASE_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}api/v1/github`

const ProjectDis = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [githubRepos, setGithubRepos] = useState([]);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const userResponse = await axios.get(BASE_URL + '/auth/me', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });
        console.log(userResponse);
        setCurrentUser(userResponse.data);
        
        const allProjectsRes = await axios.get(BASE_URL + '/projects', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });
        setAllProjects(allProjectsRes.data);
        
        if (userResponse.data) {
          const userProjectsRes = await axios.get(BASE_URL + '/user/projects', {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`
            }
          });
          setUserProjects(userProjectsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleImportFromGithub = async () => {
    try {
      setIsImporting(true);
      const reposRes = await axios.get(BASE_URL + '/github/repositories', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      setGithubRepos(reposRes.data);
      setShowRepoSelector(true);
    } catch (error) {
      console.error('Failed to fetch GitHub repositories:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSelectRepo = async (repo) => {
    try {
      setIsImporting(true);
      await axios.post(BASE_URL + '/projects/import-github', { repositoryId: repo.id }, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      
      const userProjectsRes = await axios.get(BASE_URL + '/user/projects');
      setUserProjects(userProjectsRes.data);
      
      setShowRepoSelector(false);
    } catch (error) {
      console.error('Failed to import repository:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const ProjectCard = ({ project }) => {
    console.log(project)
    return(
    <Card className="w-full bg-black text-white border-white/10">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, index) => (
            <Badge key={index} variant="">{tech}</Badge>
          ))}
        </div>
        {project.imageUrl && (
          <div className="w-full h-40 mb-4 rounded overflow-hidden">
            <img 
              src={project.imageUrl} 
              alt={`${project.name} preview`} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex justify-between items-center">
          <Badge variant={project.status === "COMPLETED" ? "success" : "secondary"} className='bg-black text-white'>
            {project.status}
          </Badge>
          <Badge>{project.projectType}</Badge>
          <a href={project.githubUrl}><EyeIcon /></a>
        </div>
      </CardContent>
    </Card>
  );
}

  const ProjectGrid = ({ projects }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-black">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );

  const RepoSelector = () => (
    <div className="mt-6 border rounded p-4 bg-black">
      <h3 className="text-lg font-medium mb-4">Select a repository to import</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {githubRepos.map(repo => (
          <Card key={repo.id} className="cursor-pointer hover:border-primary" onClick={() => handleSelectRepo(repo)}>
            <CardHeader className="p-4">
              <CardTitle className="text-base">{repo.name}</CardTitle>
              <CardDescription className="text-xs">{repo.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between items-center ">
              <Badge variant="outline" className='bg-white'>{repo.language}</Badge>
              <span className="text-xs text-white bg-white">
                {new Date(repo.updated_at).toLocaleDateString()}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={() => setShowRepoSelector(false)}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 bg-black">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      
      <Tabs defaultValue="all" className="w-full bg-black text-white">
        <TabsList className="mb-8 bg-black border border-white/10">
          <TabsTrigger value="all" className='bg-black text-white'>All Projects</TabsTrigger>
          <TabsTrigger value="user">My Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : allProjects.length > 0 ? (
            <ProjectGrid projects={allProjects} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="user">
          {!currentUser ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Sign in to view your projects</p>
              <Button asChild>
                <a href="/login">Sign In</a>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Projects</h2>
                <Button onClick={handleImportFromGithub} disabled={isImporting} className='bg-orange-500 text-white'>
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Github className="mr-2 h-4 w-4" />
                      Import from GitHub
                    </>
                  )}
                </Button>
              </div>
              
              {showRepoSelector ? (
                <RepoSelector />
              ) : isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : userProjects.length > 0 ? (
                <ProjectGrid projects={userProjects} />
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <h3 className="font-medium mb-2">You don't have any projects yet</h3>
                  <p className="text-muted-foreground mb-6">Import a project from GitHub to get started</p>
                  <Button onClick={handleImportFromGithub}>
                    <Github className="mr-2 h-4 w-4" />
                    Import from GitHub
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDis;