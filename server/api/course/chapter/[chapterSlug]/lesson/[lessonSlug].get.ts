// import {
//   Course,
//   Chapter,
//   Lesson,
//   LessonWithPath,
// } from '~/types/course';
// import course from '~/server/courseData';

// course as Course;

// export default defineEventHandler(
//   (event): LessonWithPath => {
//     const { chapterSlug, lessonSlug } =
//       event.context.params;

//     const chapter: Maybe<Chapter> = course.chapters.find(
//       (chapter) => chapter.slug === chapterSlug
//     );

//     if (!chapter) {
//       throw createError({
//         statusCode: 404,
//         message: 'Chapter not found',
//       });
//     }

//     const lesson: Maybe<Lesson> = chapter.lessons.find(
//       (lesson) => lesson.slug === lessonSlug
//     );

//     if (!lesson) {
//       throw createError({
//         statusCode: 404,
//         message: 'Lesson not found',
//       });
//     }

//     return {
//       ...lesson,
//       path: `/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
//     };
//   }
// );

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { chapterSlug, lessonSlug } = event.context.params;

  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug,
      },
    },
  });

  // error handling block here
  if (!lesson){
    throw createError({
      statusCode: 404,
      statusMessage: 'Lesson not found',
    });
  }

  return {
    ...lesson,
    path: `/course/chapter/${chapterSlug}/lesson/${lessonSlug}`,
  };
});
