import { CalorieTrackerView } from "@/features/calorie-tracker/components/CalorieTrackerView";

export const metadata = {
  title: "Tracker Kalori & Nutrisi Harian - NutriFit.AI",
  description: "Catat konsumsi makanan dan hitung makronutrisi harian Anda secara akurat.",
};

export default function CaloriesPage() {
  return <CalorieTrackerView />;
}
