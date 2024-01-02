import { z } from 'zod'

export const announcementSchema = z.object({
	title: z.string(),
	description: z.string(),
	attachment: z.custom<File>(),
	link: z.string().optional(),
})
