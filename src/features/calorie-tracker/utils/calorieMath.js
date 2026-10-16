// Rumus Mifflin-St Jeor + faktor aktivitas sesuai ketentuan tugas kuliah
export const FAKTOR_AKTIVITAS = {
  jarang: { nilai: 1.2, label: "Sedentary (Jarang/Tidak pernah olahraga)" },
  ringan: { nilai: 1.375, label: "Ringan (Olahraga 1-3x per minggu)" },
  sedang: { nilai: 1.55, label: "Sedang (Olahraga 3-5x per minggu)" },
  berat: { nilai: 1.725, label: "Berat (Olahraga 6-7x per minggu intens)" },
};

/**
 * Hitung BMR (Basal Metabolic Rate) dengan Mifflin-St Jeor
 */
export function hitungBMR({ umur, gender, tinggi, berat }) {
  const bb = Number(berat) || 0;
  const tb = Number(tinggi) || 0;
  const u = Number(umur) || 0;
  const isMale = gender === "pria";

  // Rumus Mifflin-St Jeor
  // Pria: (10 x BB) + (6.25 x TB) - (5 x U) + 5
  // Wanita: (10 x BB) + (6.25 x TB) - (5 x U) - 161
  const bmr = 10 * bb + 6.25 * tb - 5 * u + (isMale ? 5 : -161);
  return Math.round(bmr);
}

/**
 * Hitung TDEE (Total Daily Energy Expenditure)
 */
export function hitungTDEE({ umur, gender, tinggi, berat, aktivitas }) {
  const bmr = hitungBMR({ umur, gender, tinggi, berat });
  const faktor = FAKTOR_AKTIVITAS[aktivitas]?.nilai || 1.2;
  return Math.round(bmr * faktor);
}

/**
 * Hitung Target Kalori Harian berdasarkan tujuan
 */
export function hitungTargetKalori({ umur, gender, tinggi, berat, aktivitas, tujuan }) {
  const tdee = hitungTDEE({ umur, gender, tinggi, berat, aktivitas });

  let target = tdee;
  if (tujuan === "turun") target = tdee - 500; // Defisit 500 kkal untuk turun ~0.5kg/minggu
  if (tujuan === "naik") target = tdee + 300;  // Surplus 300 kkal untuk lean bulking

  // Batas aman minimum agar metabolisme tidak rusak
  const minimum = gender === "pria" ? 1500 : 1200;
  return Math.max(minimum, Math.round(target));
}

/**
 * Rekomendasi Makronutrisi (Gram) berdasarkan target kalori & tujuan
 * 1g Protein = 4 kkal, 1g Karbo = 4 kkal, 1g Lemak = 9 kkal
 */
export function hitungMakronutrisi(targetKalori, tujuan = "turun") {
  let rasio;
  if (tujuan === "turun") {
    // High protein untuk cegah muscle loss saat defisit
    rasio = { protein: 0.35, karbo: 0.40, lemak: 0.25 };
  } else if (tujuan === "naik") {
    // High carbs untuk energi surplus
    rasio = { protein: 0.25, karbo: 0.55, lemak: 0.20 };
  } else {
    // Seimbang
    rasio = { protein: 0.30, karbo: 0.45, lemak: 0.25 };
  }

  return {
    protein: Math.round((targetKalori * rasio.protein) / 4),
    karbo: Math.round((targetKalori * rasio.karbo) / 4),
    lemak: Math.round((targetKalori * rasio.lemak) / 9),
  };
}
