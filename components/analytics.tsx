import { ProjectAnalyticsResonseType } from "@/features/projects/api/use-get-project-analytics";
import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnalyticCard from "./analytic-card";
import { Separator } from "./ui/separator";

const Analytics = ({ data }: ProjectAnalyticsResonseType) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDiff > 0 ? "up" : "down"}
            increaseValue={data.taskDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDiff}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Incompletd Tasks"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDiff > 0 ? "up" : "down"}
            increaseValue={data.incompleteTaskDiff}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Analytics;
