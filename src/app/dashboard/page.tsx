import { redirect } from "next/navigation";

// Dashboard is now the Business Portal — redirect there
export default function DashboardPage() {
  redirect("/business-portal");
}
