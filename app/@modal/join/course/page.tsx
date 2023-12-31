'use client'

import { CloseDialog } from '@/components/close-dialog'
import { ModalBackground } from '@/components/modal'
import { TextField, TextFieldDescription } from '@/components/text-field'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createEnrollment } from '@/lib/actions/enrollment'
import { useRouter } from 'next/navigation'
import { FieldError, Form, Button } from 'react-aria-components'
import { useFormState, useFormStatus } from 'react-dom'

export default function Page() {
	const router = useRouter()
	const [state, action] = useFormState(createEnrollment, {
		errors: {},
		message: undefined,
	})
	const { pending } = useFormStatus()

	return (
		<ModalBackground>
			<Form
				action={action}
				className="flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-border p-4 rounded bg-card w-64"
				validationErrors={state.errors}
			>
				<div className="grid items-center">
					<CloseDialog />
				</div>
				<TextField
					className="flex flex-col gap-2"
					name="courseCode"
					type="text"
					isRequired
				>
					<Label htmlFor="courseCode" className="text-2xl">
						Class Code
					</Label>
					<Input placeholder="Class Code" />
					<TextFieldDescription className="text-xs px-1">
						Ask your teacher for the class code. Then enter it here.
					</TextFieldDescription>
					<FieldError className="text-destructive font-medium" />
				</TextField>
				<Button
					type="submit"
					className={buttonVariants()}
					isDisabled={pending}
				>
					Join Class
				</Button>
			</Form>
		</ModalBackground>
	)
}
