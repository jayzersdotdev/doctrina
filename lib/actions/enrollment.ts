'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'
import { joinCourseSchema } from '../validations/course'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type FieldErrors = z.inferFlattenedErrors<
	typeof joinCourseSchema
>['fieldErrors']

type FormState = {
	errors: FieldErrors | undefined
	message: string | undefined
}

export async function createEnrollment(
	previousState: FormState,
	formData: FormData,
): Promise<FormState> {
	const result = joinCourseSchema.safeParse({
		courseCode: formData.get('courseCode'),
	})
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session) {
		redirect('/auth/signin')
	}

	if (!result.success) {
		return {
			message: undefined,
			errors: result.error.flatten().fieldErrors,
		}
	}

	const { count } = await supabase
		.from('courses')
		.select('*', { count: 'exact', head: true })
		.eq('course_id', result.data.courseCode)
		.single()

	if (count === 0) {
		throw new Error('Course not found')
	}

	const { error: insertEnrollmentError } = await supabase
		.from('enrollments')
		.insert({
			course_id: result.data.courseCode,
			user_id: session.user.id,
		})

	if (insertEnrollmentError) {
		throw insertEnrollmentError
	}

	revalidatePath('/')
	revalidatePath('@modal/join/course')

	return {
		message: 'Successfully joined course',
		errors: undefined,
	}
}
