import { PrismaClient } from "@prisma/client";
import protectRoute from "~/server/utils/protectRoute";

const prisma = new PrismaClient();

//Endpoint that updates the progress of a lesson
export default defineEventHandler(async (event) => {
  // Only allow PUT, PATCH, and POST requests
  assertMethod(event, ["PUT", "PATCH", "POST"]);

  // Throw a 401 error if the user is not logged in
  protectRoute(event);

  // Get the route params
  const { chapterSlug, lessonSlug } = event.context.params;

  // Get the lesson from the database
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      Chapter: {
        slug: chapterSlug,
      },
    },
  });

  // if the lesson doesn't exist, throw a the 404 error
  if (!lesson) {
    throw createError({
      statusCode: 404,
      statusMessage: "Lesson not found",
    });
  }

  // Get the completed value from the request body and update progress in DB
  // Select based on the chapter and lesson slugs
  const { completed } = await readBody(event);

  // Get user email from the supabase user if there is one.
  const {
    user: { email: userEmail },
  } = event.context;
  return prisma.lessonProgress.upsert({
    where: {
      lessonId_userEmail: {
        lessonId: lesson.id,
        userEmail,
      },
    },
    update: {
      completed,
    },
    create: {
      completed,
      userEmail,
      Lesson: {
        connect: {
          id: lesson.id,
        },
      },
    },
  });
});
