import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
interface WorkspaceAvatarProps {
    image?: string;
    name: string;
    className?: string;
}

export const WorkspaceAvatar = ({ image, name, className }: WorkspaceAvatarProps) => {
    if (image) {
        return (
            <div className={cn(
                    "size-10 rounded-md overflow-hidden",
                    className,
                    getRandomClassName(name),
                )}
            >
                <Image
                    src={image}
                    width={48}
                    height={48}
                    alt={name}
                    className="object-cover"
                />
            </div>
        )
    }

    return (
        <Avatar className={cn(
            "size-10 rounded-md",
            className,
        )}>
            <AvatarFallback className={cn(
                "font-semibold text-lg uppercase text-white rounded-md",
                getRandomClassName(name),
            )}>
                {name[0].toUpperCase()}
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