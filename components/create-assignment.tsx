'use client'

import { Input } from './ui/input'
import { Tables } from '@/lib/database.types'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { TextArea } from './ui/textarea'
import { createAssignment } from '@/lib/actions/assignment'
import { useFormState } from 'react-dom'
import { TextField } from './text-field'

export async function CreateAssignment({
	course,
}: {
	course: Tables<'courses'>
}) {
	const { course_id } = course

	const createAssignmentWithCourseId = createAssignment.bind(null, course_id)
	const [state, action] = useFormState(createAssignmentWithCourseId, {
		type: null,
		message: '',
	})

	return (
		<form action={action} className="space-y-8">
			<TextField className="space-y-2" name="title">
				<Label>Assignment title</Label>
				<Input type="text" placeholder="Assignment title" />
			</TextField>
			<TextField className="space-y-2" name="description">
				<Label>Assignment description</Label>
				<TextArea />
			</TextField>

			<div>
				<Label htmlFor="dueDate">Assignment due date</Label>
				<Input
					type="date"
					id="dueDate"
					name="dueDate"
					placeholder="Assignment due date"
				/>
			</div>
			<div>
				<Label htmlFor="dueTime">Assignment due time</Label>
				<Input
					type="time"
					id="dueTime"
					name="dueTime"
					placeholder="Assignment due time"
				/>
			</div>

			<div>
				<Label htmlFor="attachment">Assignment attachment</Label>
				<Input
					type="file"
					id="attachment"
					name="attachment"
					placeholder="Assignment attachment"
				/>
			</div>

			<TextField type="url" name="link">
				<Label>Assignment Link</Label>
				<Input />
			</TextField>

			<Button type="submit">Create assignment</Button>
		</form>
	)
}
