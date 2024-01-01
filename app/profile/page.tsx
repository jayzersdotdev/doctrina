import AppShell from '@/components/app-shell'
import { SetupProfileForm } from '@/components/setup-profile-form'
import { getProfileById } from '@/lib/queries/profile'
import { createClient } from '@/lib/supabase/server'
import { unstable_noStore } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = {
	searchParams: {
		message: string
	}
}

export default async function Page({ searchParams }: Props) {
	unstable_noStore()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { message } = searchParams
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/auth/signin')
	}

	const profile = await getProfileById(user.id)

	if (!profile) {
		throw new Error('Profile not found')
	}

	return (
		<AppShell>
			<main>
				<SetupProfileForm profile={profile} message={message} />
			</main>
		</AppShell>
	)
}
