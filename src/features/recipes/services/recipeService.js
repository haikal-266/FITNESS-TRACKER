const URUTAN = ["Sarapan", "Makan siang", "Makan malam"];

// Nomor hari dari tanggal YYYY-MM-DD
function nomorHari(tanggal) {
  if (!tanggal) return Math.floor(Date.now() / 86400000);
  return Math.floor(Date.parse(tanggal) / 86400000);
}

// Algoritma rekomendasi menu harian yang berputar otomatis per tanggal
export function hitungMenuHariIni(daftarResep, tanggal) {
  if (!daftarResep || !Array.isArray(daftarResep) || daftarResep.length === 0) return [];
  const hari = nomorHari(tanggal);

  return URUTAN.map((kategori, i) => {
    const pilihan = daftarResep.filter(
      (r) => (r.category || r.kategori) === kategori
    );
    if (pilihan.length === 0) return null;
    const resep = pilihan[(hari + i) % pilihan.length];
    return {
      kategori,
      resep: {
        ...resep,
        nama: resep.nama || resep.name,
        kalori: resep.kalori || resep.calories,
        waktu: resep.waktu || resep.cookingTime || 20,
      },
    };
  }).filter(Boolean);
}

export async function fetchRecipes() {
  const res = await fetch("/api/recipes");
  if (!res.ok) throw new Error("Gagal mengambil data resep");
  return res.json();
}
