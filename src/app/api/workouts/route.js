import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const logs = await prisma.workoutLog.findMany({
      where: { date },
      orderBy: { createdAt: "desc" },
    });

    const totalBurned = Math.round(logs.reduce((sum, item) => sum + item.caloriesBurned, 0) * 10) / 10;
    const totalFat = Math.round(logs.reduce((sum, item) => sum + item.fatGrams, 0) * 10) / 10;

    return NextResponse.json({
      date,
      logs,
      summary: {
        totalBurned,
        totalFat,
      },
    });
  } catch (error) {
    console.error("GET /api/workouts error:", error);
    return NextResponse.json({ error: "Gagal memuat log latihan" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { date, exerciseName, targetMuscle, sets, value, unit, caloriesBurned, fatGrams } = body;

    if (!exerciseName) {
      return NextResponse.json({ error: "Nama gerakan latihan wajib diisi" }, { status: 400 });
    }

    const created = await prisma.workoutLog.create({
      data: {
        date: date || new Date().toISOString().split("T")[0],
        exerciseName,
        targetMuscle: targetMuscle || "Full Body",
        sets: Number(sets) || 3,
        value: Number(value) || 10,
        unit: unit || "rep",
        caloriesBurned: Number(caloriesBurned) || 0,
        fatGrams: Number(fatGrams) || 0,
        completed: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/workouts error:", error);
    return NextResponse.json({ error: "Gagal mencatat latihan selesai" }, { status: 500 });
  }
}
