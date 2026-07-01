"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail ou senha incorretos. Verifique se confirmou o e-mail.");
      setLoading(false);
      return;
    }

    if (data.session) {
      // Hard redirect so cookies are properly sent on next request
      window.location.href = "/dashboard";
    } else {
      setError("Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.");
      setLoading(false);
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
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}>
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
            Academia comercial para times de vendas
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "32px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "6px", color: "var(--text-primary)" }}>
            Entrar na plataforma
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px" }}>
            Continue de onde parou no seu treinamento.
          </p>

          <form onSubmit={handleLogin}>
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="divider" style={{ margin: "24px 0" }} />

          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Não tem conta?{" "}
            <Link href="/register" style={{ color: "var(--green-kiwi)", fontWeight: "600", textDecoration: "none" }}>
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
