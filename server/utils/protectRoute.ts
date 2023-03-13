import { H3Event } from "h3";

export default (event: H3Event) => {
  // if user is not logged in
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
};
