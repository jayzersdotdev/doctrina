import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const getProfiles = async () => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data: profiles, error } = await supabase.from('profiles').select()

	if (error) {
		throw new Error(error.message)
	}

	return profiles
}

export const getProfileById = async (id: string) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data: profile, error } = await supabase
		.from('profiles')
		.select()
		.eq('profile_id', id)
		.limit(1)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return profile
}

export const getProfileRole = async (id: string) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('profiles')
		.select('role')
		.eq('profile_id', id)
		.limit(1)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data.role
}
