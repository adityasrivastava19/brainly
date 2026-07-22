import zod from "zod";
export const contentSchema = zod.object({
    title: zod.string().min(1).max(100),
    link: zod.string().url("Invalid url"),
    tag: zod.array(zod.string()).optional(),
    type: zod.enum(["document", "tweet", "youtube", "link"])
});

