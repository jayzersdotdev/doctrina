'use server'

import humanId from 'human-id'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { courseSchema } from '../validations/course'
import { revalidatePath } from 'next/cache'
import { FormState } from '../form.types'

export async function createCourse(
	previousState: FormState,
	formData: FormData,
): Promise<FormState> {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const values = courseSchema.parse({
		title: formData.get('title'),
		description: formData.get('description'),
		section: formData.get('section'),
		subject: formData.get('subject'),
		room: formData.get('room'),
	})

	const {
		data: { session },
		error: sessionError,
	} = await supabase.auth.getSession()

	if (sessionError) {
		return {
			success: false,
			message: sessionError.message,
		}
	}

	if (!session) {
		redirect('/auth/signin')
	}

	await supabase
		.from('profiles')
		.select('user_id, role')
		.eq('user_id', session.user.id)
		.limit(1)
		.single()

	const { data: insertedCourse, error: courseError } = await supabase
		.from('courses')
		.insert({
			course_id: humanId({ separator: '-', capitalize: false }),
			course_name: values.title,
			course_description: values.description,
			section: values.section,
			subject: values.subject,
			room: values.room,
		})
		.select()
		.limit(1)
		.single()

	if (session) {
		if (!insertedCourse) throw new Error('Class not found')

		const { data: course, error: selectCourseError } = await supabase
			.from('courses')
			.select('*')
			.eq('course_id', insertedCourse?.course_id)
			.limit(1)
			.single()

		if (selectCourseError) {
			return { success: false, message: selectCourseError.message }
		}

		const { error: enrollmentsError } = await supabase
			.from('enrollments')
			.insert({
				user_id: session.user.id,
				course_id: course.course_id,
			})

		if (enrollmentsError) {
			return { success: false, message: enrollmentsError.message }
		}
	}

	if (courseError) {
		return {
			success: false,
			message: courseError.message,
		}
	}

	revalidatePath('/')
	revalidatePath('/create/course')

	return {
		success: false,
		message: 'Course created successfully',
	}
}

export async function deleteCourse(
	courseId: string,
	previousState: FormState,
	formData: FormData,
): Promise<FormState> {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const {
		error: deleteError,
		status,
		statusText,
	} = await supabase.from('courses').delete().eq('course_id', courseId)

	console.log({ status, statusText })
	if (deleteError) {
		return {
			success: false,
			message: deleteError.message,
		}
	}

	revalidatePath('/')

	return {
		success: true,
		message: 'Course deleted successfully',
	}
}
