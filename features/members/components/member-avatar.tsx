import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
interface MemberAvatarProps {
    name: string;
    className?: string;
    fallbackClassName?: string;
}

export const MemberAvatar = ({ name, className, fallbackClassName }: MemberAvatarProps) => {
    
    return (
        <Avatar className={cn(
            "size-10 rounded-full transition border border-neutral-300",
            className,
        )}>
            <AvatarFallback className={cn(
                "font-medium text-white flex items-center justify-center",
                getRandomClassName(name),
                fallbackClassName
            )}>
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}

const getRandomClassName = (name: string) => {
    const colorClasses = [
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
        "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500",
        "bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500",
        "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
        "bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500",
        "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
    ];
    const index = name.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
    }, 0) % colorClasses.length;

    return colorClasses[index];
}