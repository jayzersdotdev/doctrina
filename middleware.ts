import { createClient } from './lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
	const { supabase, response } = createClient(request)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return NextResponse.redirect(new URL('/auth/signin', request.url))
	}

	const { data: profile, error } = await supabase
		.from('profiles')
		.select('username')
		.eq('profile_id', user.id)
		.limit(1)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	if (!profile.username && request.nextUrl.pathname === '/') {
		return NextResponse.redirect(new URL('/profile', request.url))
	}

	return response
}

export const config = {
	matcher: ['/', '/profile'],
}
