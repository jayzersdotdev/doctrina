'use client'

import { CloseDialog } from '@/components/close-dialog'
import { ModalBackground } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createEnrollment } from '@/lib/actions/enrollment'
import { useFormState } from 'react-dom'

export default function Page() {
	const [state, action] = useFormState(createEnrollment, null)

	return (
		<ModalBackground>
			<form
				action={action}
				className="flex flex-col space-y-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-border p-4 rounded bg-card w-64"
			>
				<div className="grid items-center">
					<CloseDialog />
				</div>
				<Label htmlFor="courseCode" className="text-2xl">
					Class Code
				</Label>
				<p className="text-xs px-1">
					Ask your teacher for the class code. Then enter it here.
				</p>
				<Input
					type="text"
					id="courseCode"
					name="courseCode"
					placeholder="Class Code"
				/>
				<Button type="submit">Join Class</Button>
			</form>
		</ModalBackground>
	)
}
