import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import SimulationEngine from "@/components/simulation/SimulationEngine";

interface PageProps {
  params: Promise<{ simulationId: string }>;
}

export default async function SimulationPage({ params }: PageProps) {
  const { simulationId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: simulation }, { data: turns }] = await Promise.all([
    supabase.from("simulations").select("*").eq("id", simulationId).single(),
    supabase.from("simulation_turns").select("*").eq("simulation_id", simulationId).order("turn_index"),
  ]);

  if (!simulation || !turns) notFound();

  return <SimulationEngine simulation={simulation} turns={turns} userId={user.id} />;
}
