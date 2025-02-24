import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
interface CreateForumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function CreateForumDialog({ open, onOpenChange }: CreateForumDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Forum created successfully");
    setTitle("");
    setDescription("");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Create Forum</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a new forum for discussion. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white"
                placeholder="Enter forum title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white"
                placeholder="Enter forum description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-black font-medium"
            >
              Create Forum
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}