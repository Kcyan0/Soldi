"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If session exists, email confirmation is disabled — go straight to dashboard
    if (data.session) {
      window.location.href = "/dashboard";
    } else {
      // Email confirmation required
      setError("");
      setLoading(false);
      alert("✅ Conta criada! Confirme seu e-mail antes de entrar.\n\nDica: para pular a confirmação, desative 'Enable email confirmations' em:\nSupabase → Authentication → Settings");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--green-kiwi)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "800",
              color: "#000",
            }}>S</div>
            <span style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Soldi
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Comece sua jornada comercial hoje
          </p>
        </div>

        <div className="card" style={{ padding: "32px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "6px", color: "var(--text-primary)" }}>
            Criar sua conta
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px" }}>
            É grátis para começar. Sem cartão de crédito.
          </p>

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: "16px" }}>
              <label className="label" htmlFor="name">Nome completo</label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="label" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label className="label" htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div style={{
                padding: "10px 14px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px",
                color: "#EF4444",
                fontSize: "13px",
                marginBottom: "16px",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            >
              {loading ? "Criando conta..." : "Criar conta grátis"}
            </button>
          </form>

          <div className="divider" style={{ margin: "24px 0" }} />

          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Já tem conta?{" "}
            <Link href="/login" style={{ color: "var(--green-kiwi)", fontWeight: "600", textDecoration: "none" }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
