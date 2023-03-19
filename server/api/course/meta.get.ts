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
export type LessonOutline = Prisma.LessonGetPayload<typeof lessonSelect> & {
  path: string;
};

// Chapter
const chapterSelect = Prisma.validator<Prisma.ChapterArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
    lessons: lessonSelect,
  },
});
// use omit to remove the lessons property from the type
export type ChapterOutline = Omit<
  Prisma.ChapterGetPayload<typeof chapterSelect>,
  "lessons"
> & { lessons: LessonOutline[] };

//Course
const courseSelect = Prisma.validator<Prisma.CourseArgs>()({
  select: {
    title: true,
    chapters: chapterSelect,
  },
});
// use omit to remove the chapters property from the type
export type CourseOutline = Omit<
  Prisma.CourseGetPayload<typeof courseSelect>,
  "chapters"
> & { chpaters: ChapterOutline[] };

// actual event handler:
export default defineEventHandler(async (): Promise<CourseOutline> => {
  const outline = await prisma.course.findFirst(courseSelect);

  // Error if there is no course
  if (!outline) {
    throw createError({
      statusCode: 404,
      message: "Course not found",
    });
  }

  // Map the outline so we can add a path to each lesson
  const chapters = outline.chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.map((lesson) => ({
      ...lesson,
      path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`,
    })),
  }));

  return {
    ...outline,
    chapters,
  };
});
