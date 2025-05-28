"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Settings, Users } from "lucide-react";
import Link from "next/link";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";

const routes = [
    {
        label: "Home",
        href: "",
        icon: GoHome,
        activeIcon: GoHomeFill,
    },
    {
        label: "My Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        activeIcon: Settings,
    },
    {
        label: "Members",
        href: "/members",
        icon: Users,
        activeIcon: Users,
    }
];

export const Navigation = () => {
    const workspaceId = useWorkspacesId();
    const pathname = usePathname();
    return (
        <ul className="flex flex-col">
            {routes.map((item) => {
                const fulllHref = `/workspaces/${workspaceId}${item.href}`;
                const isActive = pathname === fulllHref;
                const Icon = isActive ? item.activeIcon : item.icon;
                return (
                    <Link href={fulllHref} key={item.href}>
                        <div className={cn(
                            "flex items-center gap-2.5 rounded-sm p-2.5 text-sm font-medium hover:text-primary text-neutral-500",
                            isActive && "bg-white shadow-xs hover:opacity-100 text-primary"
                        )}>
                            <Icon className="size-5 text-neutral-500" />
                            <span>{item.label}</span>
                        </div>
                    </Link>
                )
            })}
        </ul>
    )
}