import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { id: "asc" },
    });

    const parsed = recipes.map((r) => ({
      ...r,
      ingredients: typeof r.ingredients === "string" ? JSON.parse(r.ingredients) : r.ingredients,
      steps: typeof r.steps === "string" ? JSON.parse(r.steps) : r.steps,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("GET /api/recipes error:", error);
    return NextResponse.json({ error: "Gagal memuat resep makanan" }, { status: 500 });
  }
}
