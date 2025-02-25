import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import ShadCN select components
import { BACKEND_URL } from "@/config/config";

export function CreateResourceDialog({ setResourceAdded }: { setResourceAdded: any }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Added description state
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [fileType, setFileType] = useState<"image" | "pdf">("image"); // Added fileType state
  const { id: forumId } = useParams();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
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
      formData.append("description", description);
      formData.append("forumId", forumId || "");
      formData.append("category", category); // Add category to the form data
      formData.append("fileType", fileType); // Add fileType to the form data
      if (file) {
        formData.append("resource", file);
      }

      const response = await axios.post(BACKEND_URL + "/api/v1/resource/create", formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success("Your resource has been created successfully!");
        setResourceAdded((prev: any) => !prev);
      } else {
        toast.error("Failed to create resource. Please try again.");
      }

      setTitle("");
      setDescription("");
      setFile(null);
      setFilePreview(null);
      setCategory(""); // Reset category
    } catch (error) {
      toast.error("Failed to create resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r bg-orange-500 p-0 z-50">
          Create Resource
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle>Create Resource</DialogTitle>
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
              placeholder="Enter resource title"
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
              placeholder="Write a short description of the resource"
              required
            />
          </div>

          {/* File Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select File Type</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="image"
                  name="fileType"
                  value="image"
                  checked={fileType === "image"}
                  onChange={() => setFileType("image")}
                  className="mr-2"
                />
                <label htmlFor="image" className="text-sm">Image</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pdf"
                  name="fileType"
                  value="pdf"
                  checked={fileType === "pdf"}
                  onChange={() => setFileType("pdf")}
                  className="mr-2"
                />
                <label htmlFor="pdf" className="text-sm">PDF</label>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              {fileType === "image" ? "Upload Image" : "Upload PDF"}
            </label>
            <div className="relative">
              <Input
                id="file"
                type="file"
                accept={fileType === "image" ? "image/*" : "application/pdf"}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file")?.click()}
                className="w-full bg-zinc-800/50 border-zinc-700 text-white"
              >
                {fileType === "image" ? (
                  <Image className="mr-2 h-4 w-4" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                {filePreview ? "Change File" : `Upload ${fileType === "image" ? "Image" : "PDF"}`}
              </Button>
            </div>
            {filePreview && (
              <div className="relative aspect-square w-full mt-2 rounded-lg overflow-hidden">
                <img
                  src={filePreview}
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
            {isSubmitting ? "Creating..." : "Create Resource"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
