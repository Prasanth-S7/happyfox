import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, MessageSquare, Play } from "lucide-react";
interface Post {
  id: string;
  title: string;
  date: string;
  comments: number;
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
// Mock data
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "Getting Started with React Query",
    date: "2024-02-20",
    comments: 15,
  },
  {
    id: "2",
    title: "Understanding TypeScript Generics",
    date: "2024-02-19",
    comments: 8,
  },
  {
    id: "3",
    title: "Modern CSS Techniques",
    date: "2024-02-18",
    comments: 12,
  },
];
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
const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Complete React Guide PDF",
    type: "PDF",
    date: "2024-02-22",
  },
  {
    id: "2",
    title: "TypeScript Cheat Sheet",
    type: "Document",
    date: "2024-02-21",
  },
  {
    id: "3",
    title: "Frontend Architecture Diagram",
    type: "Image",
    date: "2024-02-20",
  },
];
export default function MainForum() {
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
            Advanced Web Development
          </h1>
          <p className="text-zinc-400">Created by Sarah Johnson</p>
        </div>
        {/* Tabs Section */}
        <div className="mt-8">
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="w-full bg-zinc-800/50 border border-zinc-700/50">
              <TabsTrigger value="sessions" className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Sessions
              </TabsTrigger>
              <TabsTrigger value="posts" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="resources" className="w-full">
                <Book className="mr-2 h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>
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
              <TabsContent value="posts" className="p-4 space-y-4">
                {MOCK_POSTS.map((post) => (
                  <div
                    key={post.id}
                    className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 hover:bg-zinc-800/70 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{post.title}</h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          {new Date(post.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm text-purple-400 font-medium">
                        {post.comments} comments
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="resources" className="p-4 space-y-4">
                {MOCK_RESOURCES.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 hover:bg-zinc-800/70 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{resource.title}</h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          {new Date(resource.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm text-purple-400 font-medium">
                        {resource.type}
                      </span>
                    </div>
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