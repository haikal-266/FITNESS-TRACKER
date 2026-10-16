const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses database seeding...");

  // 1. Initial User Profile
  await prisma.userProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
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

  // 2. Seed Foods dari Aplikasi diet/makanan.json jika ada
  const makananPath = path.join(__dirname, "../Aplikasi diet/makanan.json");
  if (fs.existsSync(makananPath)) {
    const rawMakanan = JSON.parse(fs.readFileSync(makananPath, "utf-8"));
    for (const item of rawMakanan) {
      await prisma.foodItem.create({
        data: {
          name: item.nama,
          unit: item.satuan,
          calories: item.kalori,
          category: "Menu Harian",
        },
      });
    }
    console.log(`Seeded ${rawMakanan.length} food items.`);
  }

  // 3. Seed Resep dari Aplikasi diet/resep.json jika ada
  const resepPath = path.join(__dirname, "../Aplikasi diet/resep.json");
  if (fs.existsSync(resepPath)) {
    const rawResep = JSON.parse(fs.readFileSync(resepPath, "utf-8"));
    for (const r of rawResep) {
      await prisma.recipe.create({
        data: {
          name: r.nama,
          category: r.kategori,
          cookingTime: r.waktu,
          portions: r.porsi,
          calories: r.kalori,
          ingredients: JSON.stringify(r.bahan),
          steps: JSON.stringify(r.langkah),
        },
      });
    }
    console.log(`Seeded ${rawResep.length} recipes.`);
  }

  // 4. Default 7-Day Workout Schedule
  const defaultSchedules = [
    {
      day: "Senin",
      focus: "Push Day (Dada, Bahu, Triceps)",
      isRestDay: false,
      exercises: JSON.stringify([
        { nama: "Push-up", set: 3, nilai: 12, tipe: "rep", met: 3.8, tips: "Jaga postur lurus" },
        { nama: "Plank", set: 3, nilai: 30, tipe: "detik", met: 3.0, tips: "Kencangkan perut" },
        { nama: "Jumping Jack", set: 1, nilai: 5, tipe: "menit", met: 8.0, tips: "Kardio pembakar lemak" },
      ]),
    },
    {
      day: "Selasa",
      focus: "Pull Day & Core (Punggung, Biceps, Perut)",
      isRestDay: false,
      exercises: JSON.stringify([
        { nama: "Sit-up", set: 3, nilai: 15, tipe: "rep", met: 3.8, tips: "Fokus kontraksi otot perut" },
        { nama: "Plank", set: 3, nilai: 45, tipe: "detik", met: 3.0, tips: "Stabilisasi core tubuh" },
        { nama: "Jalan Cepat", set: 1, nilai: 20, tipe: "menit", met: 4.3, tips: "Kardio sedang" },
      ]),
    },
    {
      day: "Rabu",
      focus: "Rest & Active Recovery",
      isRestDay: true,
      exercises: JSON.stringify([
        { nama: "Jalan Santai", set: 1, nilai: 15, tipe: "menit", met: 3.0, tips: "Pemulihan otot dan relaksasi" },
      ]),
    },
    {
      day: "Kamis",
      focus: "Leg Day (Paha, Betis, Bokong)",
      isRestDay: false,
      exercises: JSON.stringify([
        { nama: "Squat", set: 4, nilai: 15, tipe: "rep", met: 5.0, tips: "Punggung tegak, lutut sejajar kaki" },
        { nama: "Jumping Jack", set: 2, nilai: 5, tipe: "menit", met: 8.0, tips: "Tingkatkan detak jantung" },
      ]),
    },
    {
      day: "Jumat",
      focus: "Full Body HIIT & Cardio",
      isRestDay: false,
      exercises: JSON.stringify([
        { nama: "Push-up", set: 3, nilai: 10, tipe: "rep", met: 3.8, tips: "Boleh lutut menyentuh lantai bila pemula" },
        { nama: "Squat", set: 3, nilai: 12, tipe: "rep", met: 5.0, tips: "Tempo stabil" },
        { nama: "Lari / Jogging", set: 1, nilai: 20, tipe: "menit", met: 7.0, tips: "Jaga pernapasan" },
      ]),
    },
    {
      day: "Sabtu",
      focus: "Kardio Luar Ruangan / Jogging",
      isRestDay: false,
      exercises: JSON.stringify([
        { nama: "Lari / Jogging", set: 1, nilai: 30, tipe: "menit", met: 7.0, tips: "Pemanasan sebelum lari" },
      ]),
    },
    {
      day: "Minggu",
      focus: "Total Rest Day",
      isRestDay: true,
      exercises: JSON.stringify([]),
    },
  ];

  for (const s of defaultSchedules) {
    await prisma.workoutSchedule.create({
      data: s,
    });
  }

  // 5. Sample Food Log Hari Ini
  const today = new Date().toISOString().split("T")[0];
  await prisma.foodLog.createMany({
    data: [
      {
        date: today,
        mealType: "sarapan",
        foodName: "Telur rebus",
        portion: 2,
        unit: "butir",
        calories: 150,
        protein: 12,
        carbs: 1,
        fat: 10,
      },
      {
        date: today,
        mealType: "sarapan",
        foodName: "Roti tawar",
        portion: 2,
        unit: "lembar",
        calories: 150,
        protein: 4,
        carbs: 26,
        fat: 2,
      },
      {
        date: today,
        mealType: "siang",
        foodName: "Nasi putih",
        portion: 1,
        unit: "piring (150 g)",
        calories: 195,
        protein: 4,
        carbs: 43,
        fat: 0.5,
      },
      {
        date: today,
        mealType: "siang",
        foodName: "Ayam bakar",
        portion: 1,
        unit: "potong",
        calories: 200,
        protein: 26,
        carbs: 0,
        fat: 9,
      },
    ],
  });

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
