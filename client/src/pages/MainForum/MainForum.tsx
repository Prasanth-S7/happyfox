import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, MessageSquare, Play } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { CreatePostDialog } from "@/components/custom/forum/createPostDialog";
import { CreateResourceDialog } from "@/components/custom/forum/createResourceDialog";

interface Post {
    id: number;
    title: string;
    content: string;
    imageUrl: string | null;
    tags: string[];
    votes: number;
    authorId: number;
    forumId: number;
    category: string | null;
    createdAt: string;
    updatedAt: string;
    author: {
        username: string;
        id: number;
    };
    forum: {
        name: string;
        id: number;
    };
}

interface PostsResponse {
    posts: Post[];
    totalPages: number;
    currentPage: number;
}

interface Session {
    id: string;
    title: string;
    date: string;
    duration: string;
}

interface Resource {
    id: string;
    title: string;
    type: string;
    date: string;
}

const MOCK_SESSIONS: Session[] = [
    {
        id: "1",
        title: "Live Coding: Building a REST API",
        date: "2024-02-21",
        duration: "1h 30m",
    },
    {
        id: "2",
        title: "React Performance Optimization",
        date: "2024-02-20",
        duration: "45m",
    },
    {
        id: "3",
        title: "State Management Deep Dive",
        date: "2024-02-19",
        duration: "1h",
    },
];

export default function MainForum() {
    const { id: forumId } = useParams();

    const [postsData, setPostsData] = useState<PostsResponse>();
    const [forumData, setForumData] = useState();
    const [resourceData, setResourceData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [postAdded, setPostAdded] = useState(false);
    const [activeTab, setActiveTab] = useState("sessions")
    const [sessionsAdded, setSessionAdded] = useState(false);
    const [resourceAdded, setResourceAdded] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            const res = await axios.get(`http://localhost:3000/api/v1/post/all/${forumId}`);
            console.log(res.data);
            setPostsData(res.data);
            setIsLoading(false);
        }
        const fetchForumDetails = async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/forum/${forumId}`);
            setForumData(res.data);
        }

        const fetchResources = async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/resource/all/${forumId}`);
            setResourceData(res.data);
        }

        const isAdminOfThisForum = async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/forum/isAdmin/${forumId}`, {
                withCredentials: true,
            });
            console.log(res.status)
            if (res.status === 200) {
                setIsAdmin(true);
            }
        }

        fetchResources();
        fetchPosts();
        fetchForumDetails()
        isAdminOfThisForum();
    }, [forumId, postAdded, resourceAdded])

    return (
        <div className="min-h-screen bg-black text-white font-satoshi">
            {/* Banner and Profile Section */}
            <div className="relative h-48 bg-gradient-to-r from-purple-900 via-violet-800 to-purple-900">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7')] 
                     bg-cover bg-center mix-blend-overlay opacity-20"
                />
                <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-black object-cover"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black" />
                    </div>
                </div>
            </div>

            {/* Forum Info */}
            <div className="max-w-6xl mx-auto px-8 pt-20 pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        {forumData?.name || "forum Name"}
                    </h1>
                    <p className="text-zinc-400 mt-5"><span className="font-bold text-white">Created by </span>{forumData?.admin?.username || "Admin Username"}</p>
                    <p className="text-zinc-400 mt-5"><span className="font-bold text-white">Description:</span> {forumData?.description || "Admin Username"}</p>
                </div>

                {/* Tabs Section */}
                <div className="mt-8 cursor-pointer">
                    <Tabs defaultValue="sessions" className="w-full" onValueChange={(value) => {
                        setActiveTab(value);
                        console.log('hi there')
                    }}>
                        <TabsList className="w-full bg-zinc-800/50 border border-zinc-700/50 py-6 cursor-pointer z-50 relative">
                            <TabsTrigger value="sessions" className="w-full py-2 cursor-pointer">
                                <Play className="mr-2 h-4 w-4" />
                                Sessions
                            </TabsTrigger>
                            <TabsTrigger value="posts" className="w-full py-2 cursor-pointer">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Posts
                            </TabsTrigger>
                            <TabsTrigger value="resources" className="w-full py-2 cursor-pointer">
                                <Book className="mr-2 h-4 w-4" />
                                Resources
                            </TabsTrigger>
                        </TabsList>
                        {
                            !isAdmin ? (
                                <div className="text-center py-8">
                                    <p>You are not authorized to create posts, resources or sessions</p>
                                </div>
                            ) : (
                                activeTab === "posts" ? (
                                    <CreatePostDialog setPostAdded={setPostAdded} />
                                ) : activeTab === "resources" ? (
                                    <CreateResourceDialog setResourceAdded={setResourceAdded} />
                                ) : activeTab === "sessions" ? (
                                    <CreateResourceDialog setResourceAdded={setResourceAdded} />
                                ) : null
                            )
                        }
                        <ScrollArea className="h-[600px] w-full rounded-md border border-zinc-700/50 mt-4">
                            <TabsContent value="sessions" className="p-4 space-y-4">
                                {MOCK_SESSIONS.map((session) => (
                                    <div
                                        key={session.id}
                                        className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 hover:bg-zinc-800/70 transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white">{session.title}</h3>
                                                <p className="text-sm text-zinc-400 mt-1">
                                                    {new Date(session.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="text-sm text-purple-400 font-medium">
                                                {session.duration}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="posts" className="p-4">
                                {isLoading ? (
                                    <div className="text-center py-8">Loading posts...</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {postsData?.posts.map((post: any) => (
                                            <div
                                                key={post.id}
                                                className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden hover:bg-zinc-800/70 transition-all duration-200"
                                            >
                                                <div className="aspect-square w-full relative">
                                                    <img
                                                        src={`http://localhost:3000${post.imageUrl}`}
                                                        alt={post.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-white">{post.title}</h3>
                                                            <p className="text-sm text-zinc-400 mt-1">
                                                                by {post.author.username}
                                                            </p>
                                                        </div>
                                                        <span className="text-sm text-purple-400 font-medium">
                                                            {post.votes} votes
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                                                        {post.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="resources" className="p-4 space-y-4">
                                {resourceData?.resources.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 hover:bg-zinc-800/70 transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white">{resource.title}</h3>
                                                <p className="text-sm text-zinc-400 mt-1">
                                                    {new Date(resource.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-zinc-500 mt-2">{resource.description}</p>
                                            </div>
                                            <span className="text-sm text-purple-400 font-medium">
                                                {resource.type}
                                            </span>
                                        </div>

                                        <a
                                            href={`http://localhost:3000${resource.resourceUrl}`}
                                            download={resource.title}
                                            className="mt-4 inline-block bg-gradient-to-r bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                                        >
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}