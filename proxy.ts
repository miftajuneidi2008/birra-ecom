import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. Define your public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/inngest(.*)',      // Allow Inngest to register functions
  '/api/webhooks(.*)',     // Allow Clerk webhooks to trigger functions
]);

// 2. Make the function 'async'
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // 3. 'auth' is now a function that returns a promise, or an object 
    // depending on your version. Using await auth() is the safest way.
    await auth.protect(); 
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};