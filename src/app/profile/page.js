import { ProfileSettings } from "@/features/profile/components/ProfileSettings";

export const metadata = {
  title: "Profil & Kalkulator TDEE - NutriFit.AI",
  description: "Hitung kebutuhan kalori harian dan simpan data profil kesehatan Anda.",
};

export default function ProfilePage() {
  return <ProfileSettings />;
}
