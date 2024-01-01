import { Tables } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PersonIcon } from '@radix-ui/react-icons';
import { cookies } from 'next/headers';


export async function People({
    enrolledPeople,
}: {
    enrolledPeople: Tables<'enrollments'>[];
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .in(
            'profile_id',
            enrolledPeople.map((enrolledPerson) => enrolledPerson.user_id)
        );

    if (!data) return null;

    const students = data.filter((person) => person.role === 'student');
    const instructors = data.filter((person) => person.role === 'instructor');

    return (
        <div className="w-1/2 mx-auto">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Instructors
            </h2>
            <ul className="py-4">
                {instructors.map((instructor) => (
                    <li
                        key={instructor.username}
                        className="flex gap-4 items-center"
                    >
                        <Avatar>
                            <AvatarImage
                                src={instructor.avatar_url ?? ''}
                                alt={instructor.username ?? ''} />
                            <AvatarFallback>
                                <PersonIcon />
                            </AvatarFallback>
                        </Avatar>
                        <span>
                            {instructor.full_name ?? instructor.username}
                        </span>
                    </li>
                ))}
            </ul>

            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Students
            </h2>
            <ul className="py-4">
                {students.map((student) => (
                    <li
                        key={student.username}
                        className="flex gap-4 items-center"
                    >
                        <Avatar>
                            <AvatarImage
                                src={student.avatar_url ?? ''}
                                alt={student.username ?? ''} />
                            <AvatarFallback>
                                <PersonIcon />
                            </AvatarFallback>
                        </Avatar>
                        <span>{student.full_name ?? student.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
