import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"
import {TaskStatus} from "@/features/tasks/type"

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
                destructive:
                    "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
                [TaskStatus.BACKLOG]:
                    "border-transparent bg-pink-500 text-pink-500-foreground [a&]:hover:bg-pink-500/90",
                [TaskStatus.TODO]:
                    "border-transparent bg-red-500 text-red-500-foreground [a&]:hover:bg-red-500/90",
                [TaskStatus.IN_PROGRESS]:
                    "border-transparent bg-yellow-500 text-yellow-500-foreground [a&]:hover:bg-yellow-500/90",
                [TaskStatus.IN_REVIEW]:
                    "border-transparent bg-blue-500 text-blue-500-foreground [a&]:hover:bg-blue-500/90",
                [TaskStatus.DONE]:
                    "border-transparent bg-green-500 text-green-500-foreground [a&]:hover:bg-green-500/90",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({
                   className,
                   variant,
                   asChild = false,
                   ...props
               }: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span"

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({variant}), className)}
            {...props}
        />
    )
}

export {Badge, badgeVariants}
