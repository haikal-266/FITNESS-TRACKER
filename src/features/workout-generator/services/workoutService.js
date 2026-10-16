/**
 * Service API untuk modul Workout Generator & Log
 */

export async function fetchWorkoutSchedules() {
  const res = await fetch("/api/workouts/schedule");
  if (!res.ok) throw new Error("Gagal mengambil jadwal latihan");
  return res.json();
}

export async function saveGeneratedSchedule(schedules) {
  const res = await fetch("/api/workouts/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ schedules }),
  });
  if (!res.ok) throw new Error("Gagal menyimpan jadwal latihan");
  return res.json();
}

export async function fetchDailyWorkoutLogs(date) {
  const res = await fetch(`/api/workouts?date=${date}`);
  if (!res.ok) throw new Error("Gagal mengambil log latihan");
  return res.json();
}

export async function logCompletedWorkout(payload) {
  const res = await fetch("/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal mencatat latihan selesai");
  return res.json();
}
