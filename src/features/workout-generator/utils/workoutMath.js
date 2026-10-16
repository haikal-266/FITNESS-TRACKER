// Perhitungan kalori terbakar berdasarkan nilai MET (Metabolic Equivalent of Task)
// 1 kg lemak tubuh setara ~7700 kkal, sehingga 1 gram lemak = 7.7 kkal
export const KKAL_PER_GRAM_LEMAK = 7.7;

export function hitungDetikAktif(tipe, set = 3, nilai = 10, detikPerRep = 3) {
  if (tipe === "rep") return set * nilai * detikPerRep;
  if (tipe === "detik") return set * nilai;
  return nilai * 60; // tipe "menit"
}

export function hitungKaloriTerbakar({ met, beratBadan, tipe, set = 3, nilai = 10, detikPerRep = 3 }) {
  const berat = Number(beratBadan) || 65;
  const detik = hitungDetikAktif(tipe, set, nilai, detikPerRep);
  const durasiJam = detik / 3600;
  const kkal = (met || 4.0) * berat * durasiJam;

  return {
    detikAktif: detik,
    kkal: Math.round(kkal * 10) / 10,
    lemakGram: Math.round((kkal / KKAL_PER_GRAM_LEMAK) * 10) / 10,
  };
}
