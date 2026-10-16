import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let profile = await prisma.userProfile.findUnique({
      where: { id: 1 },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          id: 1,
          name: "Mahasiswa",
          age: 21,
          gender: "pria",
          height: 172,
          weight: 68,
          activityLevel: "sedang",
          goal: "turun",
          targetCalories: 1950,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Gagal mengambil data profil" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { name, age, gender, height, weight, activityLevel, goal, targetCalories } = body;

    const updated = await prisma.userProfile.upsert({
      where: { id: 1 },
      update: {
        name: name || undefined,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        activityLevel: activityLevel || undefined,
        goal: goal || undefined,
        targetCalories: targetCalories ? Number(targetCalories) : undefined,
      },
      create: {
        id: 1,
        name: name || "Mahasiswa",
        age: Number(age) || 21,
        gender: gender || "pria",
        height: Number(height) || 170,
        weight: Number(weight) || 65,
        activityLevel: activityLevel || "sedang",
        goal: goal || "turun",
        targetCalories: Number(targetCalories) || 2000,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
