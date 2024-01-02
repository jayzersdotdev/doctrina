'use client'

import { createAnnouncement } from '@/lib/actions/announcement'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { TextArea } from './ui/textarea'
import { Tables } from '@/lib/database.types'
import { TextField } from './ui/text-field'
import { useFormState, useFormStatus } from 'react-dom'

export function CreateAnnouncement({ course }: { course: Tables<'courses'> }) {
	const createAnnouncementWithCourseId = createAnnouncement.bind(
		null,
		course.course_id,
	)

	const [state, action] = useFormState(createAnnouncementWithCourseId, {
		message: '',
		success: null,
	})
	const { pending } = useFormStatus()

	return (
		<form
			action={action}
			className="flex flex-col gap-2 border border-border px-4 py-2 rounded"
		>
			<div className="flex flex-col gap-4">
				<TextField name="title" type="text" isRequired>
					<Label>Title</Label>
					<Input />
				</TextField>
				<TextField name="description" type="text" isRequired>
					<Label>Description</Label>
					<TextArea className="resize-none" />
				</TextField>
				<Label htmlFor="attachment">Upload a file</Label>
				<Input type="file" name="attachment" id="attachment" />
				<TextField type="url" name="link">
					<Label>Link</Label>
					<Input />
				</TextField>
			</div>
			<div className="flex flex-row gap-4">
				<Button
					type="submit"
					className="justify-self-end"
					disabled={pending}
				>
					Announce
				</Button>
			</div>
		</form>
	)
}
