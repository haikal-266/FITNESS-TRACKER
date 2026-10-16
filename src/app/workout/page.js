import { WorkoutView } from "@/features/workout-generator/components/WorkoutView";

export const metadata = {
  title: "Generator & Jadwal Workout Mingguan - NutriFit.AI",
  description: "Susun jadwal latihan otomatis 7 hari berbasis target dan level kebugaran fisik.",
};

export default function WorkoutPage() {
  return <WorkoutView />;
}
