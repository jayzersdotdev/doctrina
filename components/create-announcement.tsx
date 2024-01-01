import { createAnnouncement } from '@/lib/actions/announcement'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { TextArea } from './ui/textarea'
import { revalidateTag } from 'next/cache'
import { Tables } from '@/lib/database.types'
import { TextField } from './text-field'

export function CreateAnnouncement({ course }: { course: Tables<'courses'> }) {
	const action = async (formData: FormData) => {
		'use server'
		const createAnnouncementWithCourseId = createAnnouncement.bind(
			null,
			course.course_id,
		)

		createAnnouncementWithCourseId(formData)
		revalidateTag('announcements')
	}

	return (
		<form
			action={action}
			className="flex flex-col gap-2 border border-border px-4 py-2 rounded"
		>
			<div className="flex flex-col gap-4">
				<TextField>
					<Label htmlFor="title">Title</Label>
					<Input
						type="text"
						name="title"
						id="title"
						required
						placeholder="Title of your announcement"
					/>
				</TextField>
				<Label htmlFor="description">Title</Label>
				<TextArea
					placeholder="Announce something to the class"
					className="resize-none"
					id="description"
					required
					name="description"
				/>
				<Label htmlFor="attachment">Upload a file</Label>
				<Input type="file" name="attachment" id="attachment" />
				<Label htmlFor="link"> Link</Label>
				<Input
					type="url"
					name="link"
					id="link"
					placeholder="https://google.com"
				/>
			</div>
			<div className="flex flex-row gap-4">
				<Button type="submit" className="justify-self-end">
					Announce
				</Button>
			</div>
		</form>
	)
}
