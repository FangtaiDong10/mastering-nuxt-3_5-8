import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Lesson
const lessonSelect = Prisma.validator<Prisma.LessonArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
  },
});

// get the type from the lessonSelect object
export type LessonOutline = Prisma.LessonGetPayload<typeof lessonSelect>;

// Chapter
const chapterSelect = Prisma.validator<Prisma.ChapterArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
    lessons: lessonSelect,
  },
});
export type ChapterOutline = Prisma.ChapterGetPayload<typeof chapterSelect>;

//Course
const courseSelect = Prisma.validator<Prisma.CourseArgs>()({
  select: {
    title: true,
    chapters: chapterSelect,
  },
});
export type CourseOurline = Prisma.CourseGetPayload<typeof courseSelect>;

// actual event handler:
export default defineEventHandler(() => {
  return prisma.course.findFirst(courseSelect);
});

