// import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
// import { createOutput } from '@/lib/actions/output'
import { Tables } from '@/lib/database.types'
import { getAssignmentById } from '@/lib/queries/assignment'
import { getEnrollments } from '@/lib/queries/enrollment'
import { getProfileById } from '@/lib/queries/profile'
import { createClient } from '@/lib/supabase/server'
import { QueryData } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
// import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Fragment } from 'react'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { StudentView } from './student-view'

export async function generateStaticParams() {
	const supabase = createBrowserClient()
	const { data: assignments, error } = await supabase
		.from('assignments')
		.select('assignment_id')

	if (error) {
		throw new Error(`${error.message}`)
	}

	return assignments.map((assignment) => ({
		assignment: assignment.assignment_id,
	}))
}

type Props = {
	params: {
		assignment: string
	}
}

const TeacherView = async ({
	assignment,
}: {
	assignment: Tables<'assignments'>
}) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const enrollments = await getEnrollments()

	if (!enrollments) {
		notFound()
	}

	const { data: enrolledPeople } = await supabase
		.from('profiles')
		.select()
		.in(
			'profile_id',
			enrollments.map((enrollment) => enrollment.user_id),
		)

	if (!enrolledPeople) notFound()

	const students = enrolledPeople?.filter(
		(profile) => profile.role === 'student',
	)

	const outputWithStudentsQuery = supabase
		.from('outputs')
		.select(
			'output_id, attachment, submitted_at, grade, profiles ( full_name, username ) ',
		)
		.eq('assignment_id', assignment.assignment_id)
		.eq('student_id', students?.map((student) => student.profile_id))

	type OutputWithStudents = QueryData<typeof outputWithStudentsQuery>

	const { data, error } = await outputWithStudentsQuery

	if (error) throw error

	const outputsWithStudents: OutputWithStudents = data

	return (
		<div>
			<h1 className="mx-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				{assignment.title}
			</h1>
			<Separator className="my-8" />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Student</TableHead>
						<TableHead>Grade</TableHead>
						<TableHead>Output</TableHead>
						<TableHead>Submitted At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						{/* {outputsWithStudents?.map((output) => (
							<Output key={output.output_id} output={output} />
						))} */}
					</TableRow>
				</TableBody>
			</Table>
		</div>
	)
}

type OutputProps = {
	output: Omit<Tables<'outputs'>, 'assignment_id' | 'student_id'> & {
		profiles: Pick<Tables<'profiles'>, 'full_name' | 'username'> | null
	}
}

export async function Output({ output }: OutputProps) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let newFiles = []
	for (const attachment of output.attachments) {
		const { data: files } = await supabase.storage
			.from('files')
			.createSignedUrl(attachment, 3600)
		newFiles.push(files?.signedUrl)
	}
	const submittedAt = new Date(output.submitted_at)
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}

	return (
		<Fragment key={output.output_id}>
			<TableCell>
				{output.profiles?.full_name ?? output.profiles?.username}{' '}
			</TableCell>
			<TableCell>
				<form>
					<Input
						type="number"
						name="grade"
						id="grade"
						min={0}
						max={100}
						defaultValue={output.grade ?? 0}
					/>
				</form>
			</TableCell>
			<TableCell>
				{/* {newFiles ? (
					<Button variant="link" asChild>
						<Link href={file.signedUrl} target="_blank">
							View
						</Link>
					</Button>
				) : (
					<span>No file</span>
				)} */}
			</TableCell>
			<TableCell>
				{submittedAt.toLocaleDateString('en-US', options)}
			</TableCell>
		</Fragment>
	)
}

export default async function Page({ params }: Props) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/auth/signin')
	}

	const assignment = await getAssignmentById(params.assignment)

	if (!assignment) {
		notFound()
	}

	const profile = await getProfileById(user.id)

	if (!profile) {
		redirect('/auth/signin')
	}

	return (
		<main>
			{profile.role === 'student' ? (
				<StudentView assignment={assignment} userId={user.id} />
			) : (
				<TeacherView assignment={assignment} />
			)}
		</main>
	)
}
