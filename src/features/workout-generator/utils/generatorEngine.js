/**
 * Generator Otomatis Jadwal Workout Cerdas (7 Hari)
 * Mendukung variasi target, level kebugaran, dan frekuensi latihan mingguan.
 */

const EXERCISE_POOL = {
  chest: [
    { nama: "Push-up Standar", fokus: "Dada & Triceps", tipe: "rep", met: 3.8, detikPerRep: 3, tips: "Bahu rileks, siku 45 derajat" },
    { nama: "Wide Grip Push-up", fokus: "Dada Luar", tipe: "rep", met: 4.0, detikPerRep: 3, tips: "Rentangkan tangan lebih lebar dari bahu" },
    { nama: "Diamond Push-up", fokus: "Triceps & Dada Tengah", tipe: "rep", met: 4.2, detikPerRep: 3, tips: "Ibu jari & telunjuk membentuk segitiga" },
  ],
  legs: [
    { nama: "Bodyweight Squat", fokus: "Paha & Bokong", tipe: "rep", met: 5.0, detikPerRep: 3, tips: "Punggung tegak, pinggul dorong ke belakang" },
    { nama: "Walking Lunges", fokus: "Paha Depan & Keseimbangan", tipe: "rep", met: 4.8, detikPerRep: 3, tips: "Lutut depan 90 derajat tidak melewati jari kaki" },
    { nama: "Glute Bridge", fokus: "Bokong & Hamstrings", tipe: "rep", met: 3.5, detikPerRep: 3, tips: "Tahan 1 detik di puncak kontraksi" },
    { nama: "Calf Raises", fokus: "Otot Betis", tipe: "rep", met: 3.3, detikPerRep: 2, tips: "Jinjit maksimal dan rasakan kontraksi betis" },
  ],
  back: [
    { nama: "Superman Hold", fokus: "Punggung Bawah & Postur", tipe: "detik", met: 3.5, tips: "Angkat dada dan paha secara bersamaan dari lantai" },
    { nama: "Doorframe Row", fokus: "Punggung Atas & Biceps", tipe: "rep", met: 3.8, detikPerRep: 3, tips: "Gunakan kusen pintu stabil untuk menarik badan" },
  ],
  core: [
    { nama: "Plank", fokus: "Inti Tubuh & Perut", tipe: "detik", met: 3.0, tips: "Tahan garis lurus dari kepala hingga tumit" },
    { nama: "Sit-up", fokus: "Otot Perut Atas", tipe: "rep", met: 3.8, detikPerRep: 3, tips: "Tekuk lutut, jangan menarik leher" },
    { nama: "Bicycle Crunches", fokus: "Otot Perut Samping (Obliques)", tipe: "rep", met: 4.5, detikPerRep: 3, tips: "Siku sentuh lutut silang bergantian" },
    { nama: "Mountain Climbers", fokus: "Perut & Kardio Dinamis", tipe: "detik", met: 8.0, tips: "Tarik lutut ke dada cepat dalam posisi push-up" },
  ],
  cardio: [
    { nama: "Jumping Jack", fokus: "Kardio Seluruh Tubuh", tipe: "menit", met: 8.0, tips: "Mendarat dengan lembut di ujung kaki" },
    { nama: "Jalan Cepat", fokus: "Kardio Ringan & Sendi", tipe: "menit", met: 4.3, tips: "Ayunkan lengan dengan ritme konstan" },
    { nama: "Lari / Jogging", fokus: "Kardio Pembakar Kalori", tipe: "menit", met: 7.0, tips: "Pernapasan berirama (2 langkah hirup, 2 buang)" },
    { nama: "Burpees", fokus: "HIIT Full Body", tipe: "rep", met: 8.5, detikPerRep: 4, tips: "Kombinasi squat, push-up, dan lompatan" },
  ],
};

export function generateCustomWorkoutPlan({ target = "fat_loss", daysPerWeek = 4, level = "pemula" }) {
  // Atur repetisi & durasi berdasarkan level
  const setMultiplier = level === "lanjutan" ? 4 : 3;
  const repMultiplier = level === "pemula" ? 10 : level === "menengah" ? 15 : 20;
  const timeMultiplier = level === "pemula" ? 20 : level === "menengah" ? 35 : 45; // detik
  const cardioMultiplier = level === "pemula" ? 15 : level === "menengah" ? 25 : 35; // menit

  function enrichExercise(item) {
    let nilai = repMultiplier;
    if (item.tipe === "detik") nilai = timeMultiplier;
    if (item.tipe === "menit") nilai = cardioMultiplier;
    return {
      ...item,
      set: item.tipe === "menit" ? 1 : setMultiplier,
      nilai,
    };
  }

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const schedule = [];

  if (Number(daysPerWeek) === 3) {
    // 3 Days: Full Body A, Rest, Full Body B, Rest, Full Body C, Rest, Rest
    const templates = [
      {
        day: "Senin",
        focus: "Full Body A (Dada, Paha, Core)",
        isRest: false,
        exercises: [EXERCISE_POOL.chest[0], EXERCISE_POOL.legs[0], EXERCISE_POOL.core[0], EXERCISE_POOL.cardio[0]],
      },
      { day: "Selasa", focus: "Rest & Active Recovery", isRest: true, exercises: [] },
      {
        day: "Rabu",
        focus: "Full Body B (Punggung, Bahu, Legs)",
        isRest: false,
        exercises: [EXERCISE_POOL.back[0], EXERCISE_POOL.legs[1], EXERCISE_POOL.core[1], EXERCISE_POOL.cardio[1]],
      },
      { day: "Kamis", focus: "Rest Day", isRest: true, exercises: [] },
      {
        day: "Jumat",
        focus: "Full Body C (HIIT & Conditioning)",
        isRest: false,
        exercises: [EXERCISE_POOL.chest[1], EXERCISE_POOL.legs[2], EXERCISE_POOL.core[3], EXERCISE_POOL.cardio[2]],
      },
      { day: "Sabtu", focus: "Rest & Stretching", isRest: true, exercises: [] },
      { day: "Minggu", focus: "Total Rest Day", isRest: true, exercises: [] },
    ];
    templates.forEach((t) => {
      schedule.push({
        day: t.day,
        focus: t.focus,
        isRestDay: t.isRest,
        exercises: JSON.stringify(t.exercises.map(enrichExercise)),
      });
    });
  } else if (Number(daysPerWeek) === 4) {
    // 4 Days: Upper / Lower / Rest / Upper / Lower / Rest / Rest
    const templates = [
      {
        day: "Senin",
        focus: "Upper Body Strength (Dada, Punggung, Bahu)",
        isRest: false,
        exercises: [EXERCISE_POOL.chest[0], EXERCISE_POOL.back[0], EXERCISE_POOL.chest[2], EXERCISE_POOL.core[0]],
      },
      {
        day: "Selasa",
        focus: "Lower Body & Core (Paha, Bokong, Perut)",
        isRest: false,
        exercises: [EXERCISE_POOL.legs[0], EXERCISE_POOL.legs[1], EXERCISE_POOL.legs[2], EXERCISE_POOL.core[1]],
      },
      { day: "Rabu", focus: "Rest & Light Walk", isRest: true, exercises: [] },
      {
        day: "Kamis",
        focus: "Upper Body Hypertrophy & Arms",
        isRest: false,
        exercises: [EXERCISE_POOL.chest[1], EXERCISE_POOL.back[1], EXERCISE_POOL.core[2], EXERCISE_POOL.cardio[0]],
      },
      {
        day: "Jumat",
        focus: "Lower Body Power & Cardio Burn",
        isRest: false,
        exercises: [EXERCISE_POOL.legs[0], EXERCISE_POOL.legs[3], EXERCISE_POOL.core[3], EXERCISE_POOL.cardio[2]],
      },
      { day: "Sabtu", focus: "Active Recovery", isRest: true, exercises: [] },
      { day: "Minggu", focus: "Total Rest Day", isRest: true, exercises: [] },
    ];
    templates.forEach((t) => {
      schedule.push({
        day: t.day,
        focus: t.focus,
        isRestDay: t.isRest,
        exercises: JSON.stringify(t.exercises.map(enrichExercise)),
      });
    });
  } else {
    // 5 Days: Push / Pull / Legs / Upper / Cardio & Core / Rest / Rest
    const templates = [
      {
        day: "Senin",
        focus: "Push Day (Dada & Triceps)",
        isRest: false,
        exercises: [EXERCISE_POOL.chest[0], EXERCISE_POOL.chest[1], EXERCISE_POOL.chest[2], EXERCISE_POOL.core[0]],
      },
      {
        day: "Selasa",
        focus: "Pull Day (Punggung & Biceps)",
        isRest: false,
        exercises: [EXERCISE_POOL.back[0], EXERCISE_POOL.back[1], EXERCISE_POOL.core[1], EXERCISE_POOL.cardio[1]],
      },
      {
        day: "Rabu",
        focus: "Leg Day (Quad, Hamstring, Calves)",
        isRest: false,
        exercises: [EXERCISE_POOL.legs[0], EXERCISE_POOL.legs[1], EXERCISE_POOL.legs[2], EXERCISE_POOL.legs[3]],
      },
      { day: "Kamis", focus: "Rest Day", isRest: true, exercises: [] },
      {
        day: "Jumat",
        focus: "Core & Fat Burning HIIT",
        isRest: false,
        exercises: [EXERCISE_POOL.core[0], EXERCISE_POOL.core[2], EXERCISE_POOL.core[3], EXERCISE_POOL.cardio[3]],
      },
      {
        day: "Sabtu",
        focus: "Outdoor Cardio & Endurance",
        isRest: false,
        exercises: [EXERCISE_POOL.cardio[2], EXERCISE_POOL.legs[0]],
      },
      { day: "Minggu", focus: "Total Rest Day", isRest: true, exercises: [] },
    ];
    templates.forEach((t) => {
      schedule.push({
        day: t.day,
        focus: t.focus,
        isRestDay: t.isRest,
        exercises: JSON.stringify(t.exercises.map(enrichExercise)),
      });
    });
  }

  return schedule;
}
