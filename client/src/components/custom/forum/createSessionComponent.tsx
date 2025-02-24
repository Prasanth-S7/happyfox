import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";

export function CreateSessionComponent({ setSessionAdded, forumId }: { setSessionAdded: any, forumId: string | number | undefined }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [joiningLink, setJoiningLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(BACKEND_URL + "/api/v1/session/create", {
        title,
        description,
        category,
        joiningLink,
        forumId
      }, {
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Your session has been created successfully!");
        setSessionAdded((prev: any) => !prev);
      } else {
        toast.error("Failed to create session. Please try again.");
      }

      setTitle("");
      setDescription("");
      setCategory("");
      setJoiningLink("");
    } catch (error) {
      toast.error("Failed to create session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" bg-orange-500 p-0 z-50">
          Create Session
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Create Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
              placeholder="Enter session title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white min-h-[100px]"
              placeholder="Write a short description of the session"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmeet">Google Meet</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="joiningLink" className="text-sm font-medium">
              Joining Link
            </label>
            <Input
              id="joiningLink"
              type="url"
              value={joiningLink}
              onChange={(e) => setJoiningLink(e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
              placeholder="Enter session joining link"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r bg-orange-500 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Session"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
