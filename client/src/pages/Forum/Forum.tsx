import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CreateForumDialog } from "@/components/custom/forum/createForumDialog";
import { useNavigate } from "react-router-dom";

interface Forum {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  admin: {
    username: string;
  };
  _count: {
    posts: number;
  };
}

const ForumPage = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [forumsAdded, setForumsAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getForums = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/forum/all");
        setForums(res.data.forums);
      } catch (error) {
        console.error("Failed to fetch forums:", error);
      }
    };

    getForums();
  }, [forumsAdded]); 


  return (
    <div className="min-h-screen bg-black text-white p-6 font-satoshi">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Forums</h1>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-black font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Forum
          </Button>
        </div>

        {/* Forum List */}
        <div className="space-y-4">
          {forums.map((forum) => (
            <div
              key={forum.id}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 transition-all duration-300 hover:bg-zinc-800/70 cursor-pointer"
              onClick={() => navigate("/forum/" + forum.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {forum.name}
                  </h3>
                  <p className="text-zinc-400 text-sm">{forum.description}</p>
                  <p className="text-sm text-zinc-500">
                    Created by: <span className="text-white">{forum.admin.username}</span>
                  </p>
                </div>
                <div className="text-right text-sm text-zinc-400">
                  <p>{forum._count.posts} posts</p>
                  <p>Last active: {new Date(forum.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CreateForumDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          setForumsAdded = {setForumsAdded}
        />
      </div>
    </div>
  );
};

export default ForumPage;
