import React, { useEffect, useMemo, useState } from "react";

/**
 * Works with your .NET backend:
 * GET /api/admin/stats   -> AdminStatsDto
 * GET /api/admin/owners  -> { total, items }
 * GET /api/admin/users   -> { total, items }
 *
 * Safe JSON parsing => NO "Unexpected token <" crash.
 */

const safeNumber = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

async function safeFetchJson(url) {
  const res = await fetch(url);
  const contentType = res.headers.get("content-type") || "";

  // If server returned HTML or something else, don't crash
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API is not returning JSON. URL: ${url}\nReceived: ${text.slice(0, 60)}...`
    );
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return res.json();
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#f4f4f5", fg: "#27272a", bd: "#e4e4e7" },
    dark: { bg: "#111827", fg: "#fff", bd: "#111827" },
    gray: { bg: "#f3f4f6", fg: "#111827", bd: "#e5e7eb" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        border: `1px solid ${t.bd}`,
        background: t.bg,
        color: t.fg,
        fontSize: 12,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Donut({ label, value, total }) {
  const v = safeNumber(value);
  const t = Math.max(1, safeNumber(total));
  const pct = Math.max(0, Math.min(1, v / t));
  const r = 16;
  const c = 2 * Math.PI * r;
  const dash = pct * c;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={r}
          stroke="#e5e7eb"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r={r}
          stroke="#111"          // black
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 22 22)"
        />
        <text
          x="22"
          y="24"
          textAnchor="middle"
          fontSize="10"
          fontWeight="900"
          fill="#111"
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>

      <div>
        <div style={{ fontSize: 12, fontWeight: 900, color: "#111" }}>
          {label}
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#6b7280" }}>
          {v} / {t}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 900, color: "#6b7280" }}>
        {title}
      </div>
      <div style={{ marginTop: 6, fontSize: 30, fontWeight: 950, color: "#111" }}>
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("owners"); // owners | users
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // Stats from AdminStatsDto
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingOwners: 0,
    approvedOwners: 0,
    pgOwners: 0,
    messOwners: 0,
  });

  // lists
  const [owners, setOwners] = useState({ total: 0, items: [] });
  const [users, setUsers] = useState({ total: 0, items: [] });

  // table controls
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [enabled, setEnabled] = useState("all");

  const refresh = async () => {
    try {
      setErr("");
      setLoading(true);

      const dto = await safeFetchJson("/api/admin/stats");
      setStats({
        totalUsers: safeNumber(dto.totalUsers),
        activeUsers: safeNumber(dto.activeUsers),
        pendingOwners: safeNumber(dto.pendingOwners),
        approvedOwners: safeNumber(dto.approvedOwners),
        pgOwners: safeNumber(dto.pgOwners),
        messOwners: safeNumber(dto.messOwners),
      });

      const ownersRes = await safeFetchJson(
        `/api/admin/owners?type=${encodeURIComponent(type)}&status=${encodeURIComponent(
          status
        )}&q=${encodeURIComponent(q)}&page=1&pageSize=20`
      );
      setOwners(ownersRes);

      const usersRes = await safeFetchJson(
        `/api/admin/users?enabled=${encodeURIComponent(enabled)}&q=${encodeURIComponent(
          q
        )}&page=1&pageSize=20`
      );
      setUsers(usersRes);
    } catch (e) {
      setErr(e?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-fetch when filters change
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, type, enabled]);

  const ownersTotal = useMemo(() => stats.pgOwners + stats.messOwners, [stats.pgOwners, stats.messOwners]);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4", padding: 18 }}>
      <div
        style={{
          width: "min(1100px, 100%)",
          margin: "0 auto",
          background: "#fff",
          borderRadius: 18,
          border: "1px solid #eee",
          boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
          padding: 22,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 950 }}>Admin — Food & Accommodation</div>
            <div style={{ marginTop: 6, color: "#6b7280", fontWeight: 800 }}>
              Manage PG owners, Mess owners, and Users
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge tone="gray">{loading ? "Loading…" : "Live"}</Badge>
              <Badge tone="neutral">API: /api/admin/stats</Badge>
            </div>
          </div>

          {/* Donuts + Refresh (donuts LEFT of refresh) */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Donut label="Users Active" value={stats.activeUsers} total={stats.totalUsers} />
              <Donut label="Owners Approved" value={stats.approvedOwners} total={stats.pendingOwners + stats.approvedOwners || 1} />
            </div>

            <button
              onClick={refresh}
              style={{
                border: 0,
                cursor: "pointer",
                padding: "12px 16px",
                borderRadius: 14,
                fontWeight: 950,
                color: "#fff",
                background: "#111",
                minWidth: 110,
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {err ? (
          <div
            style={{
              marginTop: 14,
              border: "1px solid #fecdd3",
              background: "#fff1f2",
              color: "#9f1239",
              borderRadius: 14,
              padding: 12,
              fontWeight: 900,
              whiteSpace: "pre-wrap",
            }}
          >
            {err}
          </div>
        ) : null}

        {/* Tabs */}
        <div
          style={{
            marginTop: 16,
            background: "#f7f7f7",
            border: "1px solid #eee",
            borderRadius: 14,
            padding: 6,
            display: "inline-flex",
            gap: 6,
          }}
        >
          {[
            { key: "owners", label: "Owners" },
            { key: "users", label: "Users" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                border: 0,
                cursor: "pointer",
                padding: "10px 14px",
                borderRadius: 12,
                fontWeight: 950,
                background: tab === t.key ? "#111" : "transparent",
                color: tab === t.key ? "#fff" : "#333",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Top stats cards */}
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Active Users" value={stats.activeUsers} />
          <StatCard title="Total Owners (PG + Mess)" value={ownersTotal} />
        </div>

        {/* Filters */}
        <div
          style={{
            marginTop: 14,
            border: "1px solid #eee",
            background: "#fafafa",
            borderRadius: 16,
            padding: 12,
            display: "grid",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
              gap: 10,
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tab === "users" ? "Search users (name / mobile / email / city)" : "Search owners (name / contact / address)"}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                outline: "none",
                fontWeight: 800,
              }}
            />

            {tab === "owners" ? (
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontWeight: 900,
                  background: "#fff",
                }}
              >
                <option value="all">All Types</option>
                <option value="pg">PG</option>
                <option value="mess">Mess</option>
              </select>
            ) : (
              <select
                value={enabled}
                onChange={(e) => setEnabled(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontWeight: 900,
                  background: "#fff",
                }}
              >
                <option value="all">All Users</option>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            )}

            {tab === "owners" ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontWeight: 900,
                  background: "#fff",
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              border: "1px solid #eee",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#111", color: "#fff" }}>
                {tab === "owners" ? (
                  <>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>Owner</th>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>Type</th>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>Status</th>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>Contact</th>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>Address</th>
                  </>
                ) : (
                  <>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>User</th>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>Mobile</th>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>Email</th>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>City</th>
                    <th style={{ textAlign: "left", padding: 12, fontSize: 12 }}>Enabled</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {tab === "owners" ? (
                owners.items?.length ? (
                  owners.items.map((o) => (
                    <tr key={o.id} style={{ background: "#fff" }}>
                      <td style={{ padding: 12, fontWeight: 900 }}>{o.name || "-"}</td>
                      <td style={{ padding: 12 }}>{o.ownerType || "-"}</td>
                      <td style={{ padding: 12 }}>
                        <Badge tone="gray">{String(o.status || "-")}</Badge>
                      </td>
                      <td style={{ padding: 12 }}>{o.phone || "-"}</td>
                      <td style={{ padding: 12 }}>{o.address || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: 16, textAlign: "center", fontWeight: 900, color: "#6b7280" }}>
                      No owners found.
                    </td>
                  </tr>
                )
              ) : users.items?.length ? (
                users.items.map((u) => (
                  <tr key={u.id} style={{ background: "#fff" }}>
                    <td style={{ padding: 12, fontWeight: 900 }}>
                      {(u.firstName || "") + " " + (u.lastName || "")}
                    </td>
                    <td style={{ padding: 12 }}>{u.mobile || "-"}</td>
                    <td style={{ padding: 12 }}>{u.email || "-"}</td>
                    <td style={{ padding: 12 }}>{u.city || "-"}</td>
                    <td style={{ padding: 12 }}>
                      <Badge tone={u.enabled ? "dark" : "gray"}>{u.enabled ? "TRUE" : "FALSE"}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: 16, textAlign: "center", fontWeight: 900, color: "#6b7280" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 10, color: "#6b7280", fontWeight: 800, fontSize: 12 }}>
          Tip: If you see the HTML/doctype error again, your proxy target URL/port is wrong.
        </div>
      </div>
    </div>
  );
}
