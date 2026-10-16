import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const foods = await prisma.foodItem.findMany({
      where: query
        ? {
            name: {
              contains: query,
            },
          }
        : undefined,
      take: 50,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(foods);
  } catch (error) {
    console.error("GET /api/foods error:", error);
    return NextResponse.json({ error: "Gagal memuat database makanan" }, { status: 500 });
  }
}
