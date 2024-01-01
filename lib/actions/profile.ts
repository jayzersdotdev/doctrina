'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { profileSchema } from '@/lib/validations/profile'
import { createPostgresTimestamp } from '../utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { FormState } from '../form.types'

export async function updateProfile(previousState: FormState, formData: FormData): Promise<FormState> {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const date = new Date()
	const updated_at = createPostgresTimestamp(date)

	const values = profileSchema.safeParse({
		biography: formData.get('biography'),
		email: formData.get('email'),
		full_name: formData.get('full_name'),
		role: formData.get('role'),
		section: formData.get('section'),
		university: formData.get('university'),
		username: formData.get('username'),
		program: formData.get('program'),
		position: formData.get('position'),
	})

	const {
		data: { session },
		error: sessionError,
	} = await supabase.auth.getSession()

	if (sessionError) {
		throw sessionError
	}

	if (!session) {
		redirect('/auth/signin')
	}

	const {
		user: { id },
	} = session

	if (!values.success) {
		return { type: 'error', message: values.error.message[0] }
	}

	if (values.data.role === 'student') {
		const { error } = await supabase
			.from('profiles')
			.update({
				full_name: values.data.full_name,
				username: values.data.username,
				biography: values.data.biography,
				program: values.data.program,
				section: values.data.section,
				university: values.data.university,
				email: values.data.email,
				updated_at,
			})
			.eq('profile_id', id)

		if (error) {
			return { type: 'error', message: error.message }
		}
	} else if (values.data.role === 'instructor') {
		const { error } = await supabase
			.from('profiles')
			.update({
				avatar_url: values.data.avatar_url,
				full_name: values.data.full_name,
				username: values.data.username,
				biography: values.data.biography,
				position: values.data.position,
				email: values.data.email,
				role: values.data.role,
				updated_at,
			})
			.eq('profile_id', id)

		if (error) {
			return { type: 'error', message: error.message }
		}
	}

	revalidatePath('/profile')

	return {
		type: 'success',
		message: 'Profile updated successfully',
	}
}
