'use client'

import { useFormState } from 'react-dom'
import { TextField, TextFieldErrorMessage } from './ui/text-field'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { signInWithEmail } from '@/lib/actions/auth'

export function SignInWithEmail() {
	const [state, action] = useFormState(signInWithEmail, {
		type: null,
		message: '',
	})
	return (
		<form action={action} className="flex flex-col space-y-2">
			<div>
				<h1 className="text-xl font-bold">Sign in</h1>
				<p className="text-sm">
					Sign in via magic link with your email below
				</p>
			</div>
			<TextField isInvalid={state.type === 'error'}>
				<Label>Email</Label>
				<Input />
			</TextField>
			{state.type === 'error' && (
				<TextFieldErrorMessage>{state.message}</TextFieldErrorMessage>
			)}
			<Button type="submit">Sign In</Button>
		</form>
	)
}
