alter table "public"."announcements" drop constraint "assignments_class_id_fkey";

alter table "public"."enrollments" drop constraint "enrollments_class_id_fkey";

alter table "public"."announcements" add constraint "announcements_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(course_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."announcements" validate constraint "announcements_course_id_fkey";

alter table "public"."enrollments" add constraint "enrollments_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(course_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."enrollments" validate constraint "enrollments_course_id_fkey";


