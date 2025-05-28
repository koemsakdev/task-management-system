import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(1, { message: "Workspace name is required" }),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === "" ? undefined : value)
    .optional(),
  ])
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, { message: "Must be 1 or more characters." }).optional(),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === "" ? undefined : value)
    .optional(),
  ])
});