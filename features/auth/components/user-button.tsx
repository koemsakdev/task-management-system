"use client";
import { Loader, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/api/use-logout";
import { useCurrent } from "@/features/auth/api/use-current";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const UserButton = () => {
    const { data: user, isLoading } = useCurrent();
    const { mutate } = useLogout();
    const { name, email } = user || {};
    const avatarFallback = name ? name.charAt(0).toUpperCase() : email?.charAt(0).toUpperCase() ?? "U";

    if (isLoading) {
        return (
            <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
                <Loader className="size-4 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 rounded-full border border-neutral-300 cursor-pointer">
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                    {/* <AvatarImage src={user?.image} alt={user?.name} /> */}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" sideOffset={10} className="w-60">
                <div className="flex flex-col justify-center items-center gap-2 px-2.5 py-4">
                    <Avatar className="size-12 text-xl rounded-full border border-neutral-300">
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-neutral-900"> {name || "User"} </p>
                    <p className="text-xs font-medium text-neutral-500"> {email} </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => mutate()}>
                    <LogOut className="size-4 text-red-500" />
                    <span className="text-red-500">Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}