import { Button } from "@/components/ui/button"
import { toast } from "sonner"
export default function Landing() {
  return (
    <div className="text-white min-h-screen bg-[#0a0a0a]">
      <h1>Landing Page</h1>
      <Button variant={"secondary"} onClick={() => toast.success("hi there")}>Success</Button>
    </div>
  )
}