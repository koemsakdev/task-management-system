"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "./ui/popover";

interface DatePickerProps {
    value: Date | undefined;
    onChange: (value: Date | undefined) => void;
    className?: string;
    placeholder?: string;
}


const DatePicker = ({ value, onChange, className, placeholder = "Select date" }: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        "w-full justify-start text-left font-normal rounded-sm shadow-none hover:shadow-none hover:bg-transparent",
                        className,
                        !value && "text-muted-foreground"
                    )}
                    variant={"outline"}

                >
                    <CalendarIcon className="h-4 w-4" />
                    {value ? format(value, "PPP") : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar 
                    mode="single"
                    selected={value}
                    onSelect={(date) => onChange(date as Date)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker