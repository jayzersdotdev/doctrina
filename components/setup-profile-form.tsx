'use client'

import { Button } from '@/components/ui/button'
import { Input } from './ui/input'
import { TextArea } from './ui/textarea'
import { Tables } from '@/lib/database.types'
import { extractUsername } from '@/lib/utils'
import { cx } from '@/lib/cva.config'
import { ProfilePicture } from './profile-picture'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { updateProfile } from '@/lib/actions/profile'
import { TextField } from './ui/text-field'
import { useFormState, useFormStatus } from 'react-dom'

export function SetupProfileForm({
	profile,
	message,
}: {
	profile: Tables<'profiles'>
	message: string
}) {
	const [state, action] = useFormState(updateProfile, {
		type: null,
		message: '',
	})
	const { pending } = useFormStatus()
	console.log(state)
	return (
		<div className="max-w-2xl mx-auto space-y-2">
			<p
				className={cx(
					message ? 'visible' : 'invisible',
					'fixed z-50 bottom-4 right-4 flex flex-col items-center justify-center text-center text-sm text-gray-500 bg-gray-100 rounded-md py-2 px-4',
				)}
			>
				{message}
			</p>
			<ProfilePicture
				uid={profile.profile_id}
				url={profile.avatar_url}
				size={128}
			/>
			<form className="my-4 space-y-4" action={action} name="username">
				<TextField
					defaultValue={
						profile.username ?? extractUsername(profile.email)
					}
					name="username"
				>
					<Label>Username</Label>
					<Input />
				</TextField>
				<TextField
					defaultValue={profile.full_name ?? ''}
					name="full_name"
				>
					<Label>Display Name</Label>
					<Input />
				</TextField>
				<TextField defaultValue={profile.email ?? ''} name="email">
					<Label>Email</Label>
					<Input />
				</TextField>
				<TextField
					defaultValue={profile.biography ?? ''}
					name="biography"
				>
					<Label>Biography</Label>
					<TextArea className="resize-none" />
				</TextField>
				<TextField
					defaultValue={profile.university ?? ''}
					name="university"
				>
					<Label>University</Label>
					<Input />
				</TextField>
				<Label htmlFor="role">Role</Label>
				<RadioGroup
					defaultValue={profile.role ?? 'student'}
					id="role"
					name="role"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem
							value="student"
							id="student"
							title="Student"
						/>
						<Label htmlFor="student">Student</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem
							value="instructor"
							id="instructor"
							title="Instructor"
						/>
						<Label htmlFor="instructor">Instructor</Label>
					</div>
				</RadioGroup>

				<TextField defaultValue={profile.program ?? ''} name="program">
					<Label>Program</Label>
					<Input />
				</TextField>
				<TextField defaultValue={profile.section ?? ''} name="section">
					<Label>Section</Label>
					<Input />
				</TextField>
				<TextField
					defaultValue={profile.position ?? ''}
					name="position"
				>
					<Label>Position</Label>
					<Input />
				</TextField>
				<Button className="w-full">
					{pending ? 'Submitting	' : 'Submit'}
				</Button>
			</form>
		</div>
	)
}
