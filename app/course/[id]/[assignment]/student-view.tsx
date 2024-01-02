'use client'

import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createOutput } from '@/lib/actions/output'
import { cx } from '@/lib/cva.config'
import { Tables } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/client'
import { PlusIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import {
	Button,
	DropZone,
	FileDropItem,
	FileTrigger,
	Form,
	GridList,
	GridListItem,
	Text,
} from 'react-aria-components'
import { useFormState } from 'react-dom'

export function StudentView({
	assignment,
	userId,
}: {
	assignment: Tables<'assignments'>
	userId: string
}) {
	const createOutputBound = createOutput.bind(
		null,
		assignment.assignment_id,
		userId,
	)
	const [state, action] = useFormState(createOutputBound, {
		errors: undefined,
	})

	const [files, setFiles] = useState<File[]>([])
	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				{assignment.title}
			</h1>
			<Separator className="my-8" />
			<div>
				<p className="whitespace-pre-wrap">{assignment.description}</p>
			</div>
			<Form
				method="post"
				onSubmit={async (e) => {
					e.preventDefault()
					const supabase = createClient()
					const formData = new FormData()

					for (const file of files) {
						formData.append('files', file)
					}
					action(formData)
				}}
				className="flex flex-col border border-border p-4 rounded-md gap-4"
				validationErrors={state.errors}
			>
				<DropZone
					className={({ isDropTarget }) =>
						cx(
							'flex flex-col rounded-md border border-border p-4 transition-all',
							isDropTarget ? 'brightness-150' : 'brightness-100',
						)
					}
					onDrop={async (e) => {
						const items = e.items.filter(
							(file) => file.kind === 'file',
						) as FileDropItem[]

						const newFiles = await Promise.all(
							items.map((item) => item.getFile()),
						)

						setFiles([...files, ...newFiles])
					}}
				>
					<FileTrigger
						allowsMultiple
						onSelect={(e) => {
							if (e) {
								const newFiles = Array.from(e)
								setFiles([...files, ...newFiles])
							}
						}}
					>
						<Button
							type="button"
							className={cx(
								buttonVariants({ variant: 'outline' }),
								'inline-flex',
							)}
						>
							Select a File <PlusIcon className="pl-2 size-6" />
						</Button>
					</FileTrigger>
					<Text
						className="self-center justify-self-center"
						slot="label"
					>
						{files.length !== 0 ? (
							<ul>
								{files.map((file) => (
									<li key={file.name}>{file.name}</li>
								))}{' '}
							</ul>
						) : (
							'Drop files here'
						)}
					</Text>
				</DropZone>
				<Button
					className={buttonVariants({ variant: 'default' })}
					type="submit"
				>
					Submit Assignment
				</Button>
			</Form>
		</div>
	)
}
