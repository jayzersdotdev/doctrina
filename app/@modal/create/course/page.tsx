'use client'

import { CloseDialog } from '@/components/close-dialog'
import { ModalBackground } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TextArea } from '@/components/ui/textarea'
import { createCourse } from '@/lib/actions/course'
import { useFormState } from 'react-dom'

export default function Page() {
	const [state, action] = useFormState(createCourse, {
		message: '',
		success: null,
	})

	return (
		<ModalBackground>
			<form
				action={action}
				className="flex flex-col space-y-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-border p-4 rounded bg-card w-96"
			>
				<div className="grid items-center">
					<CloseDialog />
				</div>
				<fieldset>
					<legend className="text-lg font-semibold my-2">
						Add a class
					</legend>
					<Label htmlFor="title">Class Title</Label>
					<Input
						type="text"
						id="title"
						name="title"
						placeholder="Class Title"
					/>
					<Label htmlFor="section">Section</Label>
					<Input
						type="text"
						id="section"
						name="section"
						placeholder="Section"
					/>
					<Label htmlFor="subject">Subject</Label>
					<Input
						type="text"
						id="subject"
						name="subject"
						placeholder="Subject"
					/>
					<Label htmlFor="room">Room</Label>
					<Input
						type="text"
						id="room"
						name="room"
						placeholder="Room"
					/>
					<Label htmlFor="description">Class Description</Label>
					<TextArea
						id="description"
						name="description"
						placeholder="Class Description"
						className="resize-none"
					/>
				</fieldset>
				<Button type="submit">Create Class</Button>
			</form>
		</ModalBackground>
	)
}
