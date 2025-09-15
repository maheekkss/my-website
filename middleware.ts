import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Ambil token dari cookie
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Kalau user belum login dan akses halaman proteksi → redirect ke /login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kalau user sudah login tapi masih coba akses /login atau /register → redirect ke dashboard
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Middleware hanya jalan di route tertentu
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
