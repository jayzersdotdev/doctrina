'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'
import { joinCourseSchema } from '../validations/course'
import { revalidatePath } from 'next/cache'

export async function createEnrollment(_: any, formData: FormData) {
	const parsedData = joinCourseSchema.parse({
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

	const { count } = await supabase
		.from('courses')
		.select()
		.eq('course_id', parsedData.courseCode)
		.limit(1)
		.single()

	if (count === 0) {
		throw new Error('Course not found')
	}

	const { error: insertEnrollmentError } = await supabase
		.from('enrollments')
		.insert({
			course_id: parsedData.courseCode,
			user_id: session.user.id,
		})

	if (insertEnrollmentError) {
		throw insertEnrollmentError
	}

	revalidatePath('/')
	revalidatePath('/enroll/course')
}
