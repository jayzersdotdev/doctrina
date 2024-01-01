import { Tables } from '@/lib/database.types'
import { getEnrollments } from '@/lib/queries/enrollment'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table'

export async function Grades({
	assignments,
}: {
	assignments: Array<Tables<'assignments'>>
}) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const enrollments = await getEnrollments()

	const { data: enrolledPeopleQueryData, error: enrolledPeopleError } =
		await supabase
			.from('profiles')
			.select()
			.in(
				'profile_id',
				enrollments.map((enrollment) => enrollment.user_id),
			)

	if (enrolledPeopleError) throw enrolledPeopleError

	const enrolledPeople = enrolledPeopleQueryData

	const { data: outputsQueryData, error: outputsError } = await supabase
		.from('outputs')
		.select()
		.in(
			'assignment_id',
			assignments.map((assignment) => assignment.assignment_id),
		)
		.in(
			'student_id',
			enrolledPeople.map((person) => person.profile_id),
		)

	const students = enrolledPeople.filter(
		(profile) => profile.role === 'student',
	)
	if (outputsError) throw outputsError
	const outputs = outputsQueryData

	return (
		<div className="w-1/2 mx-auto">
			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Grades
			</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Student</TableHead>
						{assignments.map((assignment) => (
							<TableHead key={assignment.assignment_id}>
								{assignment.title}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						{students.map((student) => (
							<TableCell key={student.username}>
								{student.full_name ?? student.username}
							</TableCell>
						))}
						{outputs.map((output) => (
							<TableCell key={output.output_id}>
								{output.grade}
							</TableCell>
						))}
					</TableRow>
				</TableBody>
			</Table>
		</div>
	)
}
