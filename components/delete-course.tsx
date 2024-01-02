'use client'

import { deleteCourse } from '@/lib/actions/course'
import { Button } from 'react-aria-components'
import { useFormState } from 'react-dom'
import { buttonVariants } from './ui/button'

export function DeleteCourse({ courseId }: { courseId: string }) {
	const deleteCourseWithCourseId = deleteCourse.bind(null, courseId)
	const [state, action] = useFormState(deleteCourseWithCourseId, {
		success: null,
		message: '',
	})
	return (
		<form action={action}>
			<Button
				className={buttonVariants({ variant: 'ghost' })}
				type="submit"
			>
				Delete Course
			</Button>
		</form>
	)
}
