'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { getProfileById } from '../queries/profile'
import { FormState } from '../form.types'

const outputSchema = z.object({
	files: z.custom<File[]>(),
})
export const createOutput = async (
	assignmentId: string,
	studentId: string,
	previousState: { errors: Record<string, string | string[]> | undefined },
	formData: FormData,
): Promise<{ errors: Record<string, string | string[]> | undefined }> => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const values = outputSchema.parse({
		files: formData.getAll('files'),
	})

	const profile = await getProfileById(studentId)
	const newFiles = []
	for (const file of values.files) {
		const { data, error: fileError } = await supabase.storage
			.from('files')
			.upload(
				`assignments/${assignmentId}/${profile.username}/${file.name}`,
				file,
				{
					upsert: true,
				},
			)

		if (fileError) {
			return {
				errors: {
					file: fileError.message,
				},
			}
		}

		newFiles.push(data?.path)
	}

	const { error: outputError } = await supabase.from('outputs').insert({
		assignment_id: assignmentId,
		student_id: studentId,
		attachments: newFiles,
		grade: 0,
		submitted_at: new Date().toISOString(),
	})

	if (outputError) {
		return {
			errors: {
				output: outputError.message,
			},
		}
	}

	return {
		errors: undefined,
	}
}
