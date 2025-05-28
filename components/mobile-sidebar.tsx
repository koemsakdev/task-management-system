"use client";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetDescription,
    SheetTitle
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import SideBar from "./sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MobileSidebar = () => {
    const [open, setOpen] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathName]);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size={"icon"} variant={"secondary"} className="lg:hidden cursor-pointer">
                    <Menu className="size-4 text-neutral-500" />
                </Button>
            </SheetTrigger>
            <SheetContent className="p-0" side="left">
                <VisuallyHidden>
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>
                        Navigation Menu
                    </SheetDescription>
                </VisuallyHidden>
                <SideBar />
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar