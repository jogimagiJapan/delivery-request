import { NextRequest, NextResponse } from "next/server";

const AUTH_KEY = process.env.NEXT_PUBLIC_AUTH_KEY ?? "event_2026";

export function proxy(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname === "/") {
        const key = searchParams.get("key");
        const hasValidCookie = request.cookies.get("sts_auth_session")?.value === "valid";

        if (key === AUTH_KEY) {
            // パラメータが正しい場合、リクエストを進めつつCookieをセット
            const response = NextResponse.next();
            response.cookies.set("sts_auth_session", "valid", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 1日間有効
            });
            return response;
        } else if (hasValidCookie) {
            // Cookieによる認証が済んでいればOK
            return NextResponse.next();
        } else {
            // どちらもない場合は未認証として扱う
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};
