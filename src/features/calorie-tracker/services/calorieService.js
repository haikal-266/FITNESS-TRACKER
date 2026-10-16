/**
 * Service API untuk modul Calorie Tracker
 */

export async function fetchDailyLogs(date) {
  const res = await fetch(`/api/calories?date=${date}`);
  if (!res.ok) throw new Error("Gagal mengambil data log makanan");
  return res.json();
}

export async function addFoodLog(payload) {
  const res = await fetch("/api/calories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal menambahkan log makanan");
  return res.json();
}

export async function deleteFoodLog(id) {
  const res = await fetch(`/api/calories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal menghapus log makanan");
  return res.json();
}

export async function searchFoods(query = "") {
  const res = await fetch(`/api/foods?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Gagal mencari database makanan");
  return res.json();
}
