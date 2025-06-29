import React from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface AnalyticCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}

const AnalyticCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";
  return (
    <Card className="shadow-none border-none w-full min-w-[220px] overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncat text-base">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1">
            <Icon className={cn(iconColor, "size-4")} />
            <span
              className={cn(
                increaseValueColor,
                "text-base font-medium truncate"
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="text-3xl font-extrabold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default AnalyticCard;
