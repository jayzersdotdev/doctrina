alter table "public"."outputs" drop column "attachment";

alter table "public"."outputs" add column "attachments" text[] not null;


