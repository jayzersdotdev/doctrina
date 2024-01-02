'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { assignmentSchema } from '../validations/assignment'
import { revalidatePath } from 'next/cache'
import { getProfileById } from '../queries/profile'
import { constructDueDate, createPostgresTimestamp } from '../utils'
import { FormState } from '../form.types'
import { redirect } from 'next/navigation'

export async function createAssignment(
	course_id: string,
	previousState: FormState,
	formData: FormData,
): Promise<FormState> {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const dueDate = constructDueDate(
		formData.get('dueDate') as string,
		formData.get('dueTime') as string,
	)
	const timestamp = createPostgresTimestamp(dueDate)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/auth/signin')
	}

	const profile = await getProfileById(user.id)

	const values = assignmentSchema.parse({
		title: formData.get('title'),
		description: formData.get('description'),
		attachment: formData.get('attachment'),
		link: formData.get('link'),
		due_date: formData.get('dueDate'),
		due_time: formData.get('dueTime'),
	})

	if (values.attachment.name === 'undefined' && !values.link) {
		const { error: assignmentError } = await supabase
			.from('assignments')
			.insert({
				title: values.title,
				description: values.description,
				due_date: timestamp.toString(),
				course_id: course_id,
				instructor_id: profile.profile_id,
			})
			.limit(1)
			.single()

		if (assignmentError) {
			return {
				success: false,
				message: assignmentError.message,
			}
		}

		revalidatePath(`/course/${course_id}`)

		return {
			success: true,
			message: 'Assignment created successfully',
		}
	}

	if (values.attachment.name !== 'undefined' && values.link) {
		const { error: assignmentError } = await supabase
			.from('assignments')
			.insert({
				title: values.title,
				due_date: dueDate.toString(),
				course_id: course_id,
				instructor_id: profile.profile_id,
				links: values.link,
			})
			.single()

		if (assignmentError) {
			return {
				success: false,
				message: assignmentError.message,
			}
		}

		revalidatePath(`/course/${course_id}`)

		return {
			success: true,
			message: 'Assignment created successfully',
		}
	}

	if (values.link) {
		const { error: linkError } = await supabase
			.from('assignments')
			.insert({
				course_id: course_id,
				instructor_id: profile.profile_id,
				due_date: dueDate.toString(),
				title: values.title,
				description: values.description,
				links: values.link,
			})
			.limit(1)
			.single()

		if (linkError) {
			return {
				success: false,
				message: linkError.message,
			}
		}

		revalidatePath(`/courses/${course_id}`)

		return {
			success: true,
			message: 'Assignment created successfully',
		}
	}

	if (values.attachment.name !== 'undefined') {
		const { data: assignmentFiles, error: assignmentFilesError } =
			await supabase.storage
				.from('files')
				.upload(
					`assignments/${values.attachment.name}`,
					values.attachment,
					{
						upsert: true,
					},
				)

		if (assignmentFilesError) {
			return {
				success: false,
				message: assignmentFilesError.message,
			}
		}

		const { error: assignmentError } = await supabase
			.from('assignments')
			.insert({
				title: values.title,
				due_date: dueDate.toString(),
				attachment: assignmentFiles.path,
				course_id: course_id,
				instructor_id: profile.profile_id,
			})
			.limit(1)
			.single()

		if (assignmentError) {
			return {
				success: false,
				message: assignmentError.message,
			}
		}

		revalidatePath(`/course/${course_id}`)

		return {
			success: true,
			message: 'Assignment created successfully',
		}
	}

	return {
		success: false,
		message: 'Something went wrong',
	}
}
