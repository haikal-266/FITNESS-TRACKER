import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.foodLog.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: "Log makanan berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/calories/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus log makanan" }, { status: 500 });
  }
}
