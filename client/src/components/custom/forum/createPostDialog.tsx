import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, Plus } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import ShadCN select components
import { BACKEND_URL } from "@/config/config";

export function CreatePostDialog({ setPostAdded }: { setPostAdded: any }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<string>("");
  const { id: forumId } = useParams();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("forumId", forumId || "");
      formData.append("category", category); // Add category to the form data
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(import.meta.env.VITE_BACKEND_BASE_URL + "api/v1/post/create", formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Your post has been created successfully!");
        setPostAdded((prev: any) => !prev);
      } else {
        toast.error("Failed to create post. Please try again.");
      }

      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setCategory(""); // Reset category
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer bg-orange-500 hover:bg-orange-600 p-0 relative z-50">
        <Button className=" ">
          Create Post
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
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
              placeholder="Enter post title"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white min-h-[100px]"
              placeholder="Write your post content..."
              required
            />
          </div>
          
          {/* Category Select Box */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Blockchain">Blockchain</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Image
            </label>
            <div className="relative">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
                className="w-full bg-zinc-800/50 border-zinc-700 text-white"
              >
                <Image className="mr-2 h-4 w-4" />
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>
            </div>
            {imagePreview && (
              <div className="relative aspect-square w-full mt-2 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r bg-orange-500 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
