export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--bg-primary)",
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        marginLeft: "220px",
      }}>
        <TopBar profile={profile} user={user} />
        <main style={{
          flex: 1,
          padding: "32px",
          maxWidth: "1100px",
          width: "100%",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
