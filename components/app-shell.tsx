import { Suspense } from 'react'
import { Header } from './header'
import { HeaderSkeleton } from './header-skeleton'
import { redirect } from 'next/navigation'
import { getProfileById } from '@/lib/queries/profile'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

type Props = {
	children: React.ReactNode
}

export default async function AppShell({ children }: Props) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/auth/signin')
	}

	const { id } = user

	const { data: profileQuery, error } = await supabase
		.from('profiles')
		.select('username, avatar_url, role')
		.eq('profile_id', id)
		.limit(1)
		.single()

	if (error) {
		throw new Error(`{ code: ${error.code}, hint: ${error.hint}, message: ${error.message}
			details: ${error.details}
		}`)
	}

	const profile = profileQuery

	return (
		<>
			<Suspense fallback={<HeaderSkeleton />}>
				<Header profile={profile} />
			</Suspense>
			<div className="flex flex-col">{children}</div>
		</>
	)
}
