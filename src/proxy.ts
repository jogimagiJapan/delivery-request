import { NextRequest, NextResponse } from "next/server";

const AUTH_KEY = process.env.NEXT_PUBLIC_AUTH_KEY ?? "event_2026";

export function proxy(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // / のみ認証対象（APIルート・静的ファイル・complete・unauthorizedは除外）
    if (pathname === "/") {
        const key = searchParams.get("key");
        if (key !== AUTH_KEY) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};
