import { HamIcon } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Sidebar = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <Button className="bg-transparent flex items-center justify-center text-foreground w-[50px] h-[50px] hover:bg-slate-100 cursor-pointer rounded-full">
                    <HamIcon />
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                Side Bar
            </SheetContent>
        </Sheet>
    )
}

export default Sidebar;