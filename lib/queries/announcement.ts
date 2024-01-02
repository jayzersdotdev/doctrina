import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const getAnnouncementIds = async () => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data: announcements } = await supabase
		.from('announcements')
		.select('announcement_id')

	if (!announcements) {
		throw new Error('No announcements found')
	}

	return announcements.map((announcements) => announcements.announcement_id)
}

export const getAnnouncementById = async (id: string) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data: announcement } = await supabase
		.from('announcements')
		.select()
		.eq('announcement_id', id)
		.limit(1)
		.single()

	return announcement
}

export const getAnnouncements = async (courseId: string) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data: announcements } = await supabase
		.from('announcements')
		.select()
		.eq('course_id', courseId)

	return announcements
}
