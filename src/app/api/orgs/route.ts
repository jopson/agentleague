import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSecret } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await requireAdminSecret();

    const body = (await req.json()) as {
      slug: string;
      displayName: string;
      adminEmail: string;
    };

    if (!body.slug || !body.displayName || !body.adminEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const org = await prisma.org.create({
      data: {
        slug: body.slug,
        displayName: body.displayName,
        users: {
          create: {
            email: body.adminEmail,
            isAdmin: true,
          },
        },
        subscription: { create: {} },
      },
      include: { users: true },
    });

    return NextResponse.json({ org });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
