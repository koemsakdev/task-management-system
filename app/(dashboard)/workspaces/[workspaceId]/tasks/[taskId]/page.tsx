import React from "react";
import TaskIdClient from "./client";
import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

const TaskIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <TaskIdClient />;
};

export default TaskIdPage;
