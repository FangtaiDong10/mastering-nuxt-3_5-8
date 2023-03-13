import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  // console.log("user", user);
  // add our user onto our event
  event.context.user = user;
})