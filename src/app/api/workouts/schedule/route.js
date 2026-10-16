import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const schedules = await prisma.workoutSchedule.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("GET /api/workouts/schedule error:", error);
    return NextResponse.json({ error: "Gagal mengambil jadwal latihan" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { schedules } = body;

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return NextResponse.json({ error: "Data jadwal tidak valid" }, { status: 400 });
    }

    // Bersihkan jadwal lama dan simpan jadwal baru yang digenerate
    await prisma.workoutSchedule.deleteMany({});

    for (const item of schedules) {
      await prisma.workoutSchedule.create({
        data: {
          day: item.day,
          focus: item.focus,
          isRestDay: Boolean(item.isRestDay),
          exercises: typeof item.exercises === "string" ? item.exercises : JSON.stringify(item.exercises),
        },
      });
    }

    const updated = await prisma.workoutSchedule.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/workouts/schedule error:", error);
    return NextResponse.json({ error: "Gagal memperbarui jadwal latihan" }, { status: 500 });
  }
}
