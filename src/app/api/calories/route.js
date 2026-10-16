import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const logs = await prisma.foodLog.findMany({
      where: { date },
      orderBy: { createdAt: "desc" },
    });

    const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = Math.round(logs.reduce((sum, item) => sum + (item.protein || 0), 0) * 10) / 10;
    const totalCarbs = Math.round(logs.reduce((sum, item) => sum + (item.carbs || 0), 0) * 10) / 10;
    const totalFat = Math.round(logs.reduce((sum, item) => sum + (item.fat || 0), 0) * 10) / 10;

    return NextResponse.json({
      date,
      logs,
      summary: {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      },
    });
  } catch (error) {
    console.error("GET /api/calories error:", error);
    return NextResponse.json({ error: "Gagal memuat log makanan" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { date, mealType, foodName, portion, unit, calories, protein, carbs, fat } = body;

    if (!foodName || !calories) {
      return NextResponse.json({ error: "Nama makanan dan kalori wajib diisi" }, { status: 400 });
    }

    const created = await prisma.foodLog.create({
      data: {
        date: date || new Date().toISOString().split("T")[0],
        mealType: mealType || "sarapan",
        foodName,
        portion: Number(portion) || 1,
        unit: unit || "porsi",
        calories: Math.round(Number(calories)),
        protein: protein ? Number(protein) : 0,
        carbs: carbs ? Number(carbs) : 0,
        fat: fat ? Number(fat) : 0,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/calories error:", error);
    return NextResponse.json({ error: "Gagal menyimpan log makanan" }, { status: 500 });
  }
}
