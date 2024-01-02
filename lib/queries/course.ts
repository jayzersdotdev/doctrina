import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const getCourseById = async (id: string) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data: course } = await supabase
		.from('courses')
		.select()
		.eq('course_id', id)
		.limit(1)
		.single()

	return course
}
export const getCourseIds = async () => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data: courses } = await supabase.from('courses').select('course_id')

	if (!courses) {
		notFound()
	}

	return courses.map((course) => course.course_id)
}

export const getCourses = async () => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data: courses, error } = await supabase.from('courses').select()

	if (error) {
		throw error
	}

	return courses
}
