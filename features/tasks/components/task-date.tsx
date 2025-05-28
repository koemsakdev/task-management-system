import React from 'react'
import { differenceInDays, format } from 'date-fns'
import { cn } from '@/lib/utils'

interface TaskDateProps {
    value: string;
    className?: string;
}

const TaskDate = ({ value, className }: TaskDateProps) => {
    const today = new Date();
    const endDate = new Date(value);
    const diffDate = differenceInDays(endDate, today);
    let textColor = "text-blue-500";
    if (diffDate <= 3) {
        textColor = "text-red-500";
    } else if (diffDate <= 7) {
        textColor = "text-orange-500";
    } else if (diffDate <= 14) {
        textColor = "text-yellow-500";
    }
    return (
        <div className={textColor}>
            <span className={cn(
                "truncate",
                className
            )}>
                {format(value, "PPP")}
            </span>
        </div>
    )
}

export default TaskDate