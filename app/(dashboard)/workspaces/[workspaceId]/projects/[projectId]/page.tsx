import React from "react";
import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import ProjectClientId from "./client";

const ProjectIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <ProjectClientId />;
};

export default ProjectIdPage;
