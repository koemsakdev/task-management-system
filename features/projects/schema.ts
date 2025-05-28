import { z } from "zod";
export const projectSchema = z.object({
    name: z.string().min(1, { message: "Project name is required" }),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
            .optional(),
    ]),
    workspaceId: z.string()
});

export const updateProjectSchema = z.object({
    name: z.string().min(1, { message: "Must be 1 or more characters." }).optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
            .optional(),
    ])
});