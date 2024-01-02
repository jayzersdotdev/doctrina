'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { announcementSchema } from '../validations/announcement'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { FormState } from '../form.types'

export async function createAnnouncement(
	course_id: string,
	previousState: FormState,
	formData: FormData,
): Promise<FormState> {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const values = announcementSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description'),
		attachment: formData.get('attachment'),
		link: formData.get('link'),
	})

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser()

	if (userError) {
		throw new Error(userError.message)
	}

	if (!user) {
		redirect('/auth/signin')
	}

	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('profile_id')
		.eq('profile_id', user.id)
		.limit(1)
		.single()

	if (!values.success) {
		return {
			success: values.success,
			message: values.error.flatten().formErrors[0],
		}
	}

	if (profileError) {
		return {
			success: false,
			message: profileError.message,
		}
	}

	if (!values.data.link && values.data.attachment.name === 'undefined') {
		const { error: insertError } = await supabase
			.from('announcements')
			.insert({
				title: values.data.title,
				description: values.data.description,
				course_id: course_id,
				profile_id: profile.profile_id,
			})

		if (insertError) {
			return { success: false, message: insertError.message }
		}

		revalidatePath(`/course/${course_id}`)

		return {
			success: true,
			message: 'Announcement successfully created',
		}
	}

	if (values.data.attachment.name !== 'undefined' && values.data.link) {
		const { data: file, error: uploadError } = await supabase.storage
			.from('files')
			.upload(
				`announcements/${values.data.attachment.name}`,
				values.data.attachment,
				{ upsert: true },
			)

		if (uploadError) {
			return {
				success: false,
				message: uploadError.message,
			}
		}

		const { error } = await supabase.from('announcements').insert({
			title: values.data.title,
			description: values.data.description,
			course_id: course_id,
			profile_id: profile.profile_id,
			attachment: file.path,
			links: values.data.link,
		})

		if (error) {
			return {
				success: false,
				message: error.message,
			}
		}

		revalidatePath(`/course/${course_id}`)

		return {
			success: true,
			message: 'Announcement successfully created',
		}
	}

	if (values.data.link) {
		const { error } = await supabase.from('announcements').insert({
			title: values.data.title,
			description: values.data.description,
			course_id: course_id,
			profile_id: profile.profile_id,
			links: values.data.link,
		})

		if (error) {
			return {
				success: false,
				message: error.message,
			}
		}
		revalidatePath(`/course/${course_id}`)

		return {
			success: true,
			message: 'Announcement successfully created',
		}
	}

	if (values.data.attachment.name !== 'undefined') {
		const { data: file, error: uploadError } = await supabase.storage
			.from('files')
			.upload(
				`announcements/${values.data.attachment.name}`,
				values.data.attachment,
				{
					upsert: true,
				},
			)

		if (uploadError) {
			return {
				success: false,
				message: uploadError.message,
			}
		}

		const { error } = await supabase.from('announcements').insert({
			title: values.data.title,
			description: values.data.description,
			course_id: course_id,
			profile_id: profile.profile_id,
			attachment: file.path,
		})

		if (error) {
			return {
				success: false,
				message: error.message,
			}
		}

		revalidatePath(`/course/${course_id}`)
		return {
			success: true,
			message: 'Announcement successfully created',
		}
	}

	return {
		success: false,
		message: 'Something went wrong',
	}
}
