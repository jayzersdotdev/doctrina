'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { signInWithEmailSchema } from '../validations/auth'
import { getURL } from '../utils'
import { FormState } from '../form.types'

export async function signInWithGoogle() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { error, data } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: getURL(`/api/auth/callback`),
		},
	})

	if (error) {
		console.error(error)
		throw new Error(error.message)
	}

	redirect(data.url)
}

export async function signInWithEmail(
	previousState: FormState,
	formData: FormData,
): Promise<FormState> {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const redirectURL = getURL(`/api/auth/confirm`)

	const values = signInWithEmailSchema.safeParse({
		email: formData.get('email'),
	})

	if (!values.success) {
		return {
			type: 'error',
			message: values.error.message,
		}
	}

	const { error } = await supabase.auth.signInWithOtp({
		email: values.data.email,
		options: {
			data: {
				email: values.data.email,
			},
			emailRedirectTo: redirectURL,
		},
	})

	if (error) {
		return { type: 'error', message: error.message }
	}

	return {
		type: 'success',
		message: 'Check your email for the login link',
	}
}
