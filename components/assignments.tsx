'use client'

import { Tables } from '@/lib/database.types'
import { CreateAssignment } from './create-assignment'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Attachments } from './attachments'
import { buttonVariants } from './ui/button'
import Link from 'next/link'

export async function Assignments({
	course,
	assignments,
	profile,
}: {
	course: Tables<'courses'>
	assignments: Array<Tables<'assignments'>>
	profile: Tables<'profiles'>
}) {
	return (
		<>
			<div className="border rounded px-4 py-2 w-1/2 mx-auto">
				{profile.role === 'instructor' && (
					<CreateAssignment course={course} />
				)}

				<div className="flex flex-col gap-4 py-8">
					{assignments.length > 0 ? (
						assignments.map((assignment) => (
							<Card key={assignment.assignment_id}>
								<CardHeader>
									<CardTitle>{assignment.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="whitespace-pre-line">
										{assignment.description}
									</p>
								</CardContent>
								<CardFooter className="flex flex-col gap-4">
									{assignment.attachment && (
										<div className="grid grid-cols-2">
											<Attachments
												attachment={
													assignment.attachment
												}
											/>
										</div>
									)}
									{profile.role === 'student' && (
										<Link
											href={`/course/${course.course_id}/${assignment.assignment_id}`}
											className={buttonVariants({
												className: 'w-full',
												variant: 'default',
												size: 'default',
											})}
										>
											<span className="pl-2">
												View More
											</span>
										</Link>
									)}
									{profile.role === 'instructor' && (
										<Link
											href={`/course/${course.course_id}/${assignment.assignment_id}`}
											className={buttonVariants({
												className: 'w-full',
												variant: 'default',
												size: 'default',
											})}
										>
											<span className="pl-2">Grade</span>
										</Link>
									)}
								</CardFooter>
							</Card>
						))
					) : (
						<p className="leading-7 [&:not(:first-child)]:mt-6">
							Your assignments will appear here.
						</p>
					)}
				</div>
			</div>
		</>
	)
}
