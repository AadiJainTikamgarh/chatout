import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  try {
    const path = request.nextUrl.pathname;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const publicPath = path === "/login" || path === "/signup" || path === "/";

    if (publicPath && token) {
      return NextResponse.redirect(new URL("/chats", request.url));
    }

    if (path === "/chats" && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    console.log("Something went wrong: ", error.message);
  }
}

export const config = {
  matcher: ["/login", "/signup", "/", "/chats"],
};
