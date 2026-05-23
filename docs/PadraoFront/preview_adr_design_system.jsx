import React from "react";
import {
  LayoutDashboard,
  Ticket,
  MessageCircle,
  Database,
  Settings,
  Bell,
  Search,
  Plus,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ArrowUpRight,
  Palette,
  Type,
  Component,
  ShieldCheck,
} from "lucide-react";

const colors = [
  ["Smart Blue", "#0466c8", "Ação primária"],
  ["Sapphire", "#0353a4", "Hover / destaque"],
  ["Regal Navy", "#023e7d", "Estado ativo"],
  ["Prussian Blue", "#002855", "Superfície forte"],
  ["Prussian Blue 2", "#001845", "Sidebar"],
  ["Prussian Blue 3", "#001233", "Background app"],
  ["Twilight Indigo", "#33415c", "Borda / bloco"],
  ["Blue Slate", "#5c677d", "Texto desabilitado"],
  ["Slate Grey", "#7d8597", "Texto secundário"],
  ["Lavender Grey", "#979dac", "Texto muted"],
];

const typeScale = [
  ["H1", "36px", "700", "Título principal"],
  ["H2", "30px", "700", "Título de dashboard"],
  ["H3", "24px", "600", "Título de seção"],
  ["H4", "20px", "600", "Título de card"],
  ["Body", "14px / 16px", "400", "Texto de interface"],
  ["Caption", "12px", "500", "Metadados e labels"],
  ["Overline", "11px", "600", "Labels em uppercase"],
];

const statusBadges = [
  { label: "Aberto", cls: "text-emerald-300 bg-emerald-400/10 border-emerald-400/25" },
  { label: "Em andamento", cls: "text-amber-300 bg-amber-400/10 border-amber-400/25" },
  { label: "Resolvido", cls: "text-sky-300 bg-sky-400/10 border-sky-400/25" },
  { label: "Urgente", cls: "text-red-300 bg-red-400/10 border-red-400/25" },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Tickets", icon: Ticket },
  { label: "Mensagens", icon: MessageCircle },
  { label: "Base KB", icon: Database },
  { label: "Configurações", icon: Settings },
];

function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-[#979dac]/15 bg-[#0b1328] shadow-[0_1px_2px_rgba(0,0,0,.24)] ${className}`}>
      {children}
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "text-[#0466c8] bg-[#0466c8]/15 border-[#0466c8]/20",
    green: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    red: "text-red-300 bg-red-400/10 border-red-400/20",
  };

  return (
    <Card className="p-5 transition hover:border-[#979dac]/25">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#979dac]">{title}</p>
          <p className="mt-3 text-3xl font-bold leading-none text-slate-50">{value}</p>
        </div>
        <div className={`rounded-xl border p-2.5 ${tones[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-xl border border-[#0466c8]/20 bg-[#0466c8]/15 p-2 text-[#38bdf8]">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-[#979dac]">{description}</p>
      </div>
    </div>
  );
}

export default function ADRDesignSystemPreview() {
  return (
    <div className="min-h-screen bg-[#001233] text-slate-100" style={{ fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-[#979dac]/10 bg-[#001845] p-4 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0466c8] to-[#001233] shadow-[0_12px_32px_rgba(4,102,200,.24)]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-50">ADR Preview</p>
              <p className="text-xs text-[#979dac]">Design System</p>
            </div>
          </div>

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5c677d]">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    item.active
                      ? "border-l-2 border-[#0466c8] bg-[#0466c8]/15 text-slate-50"
                      : "text-[#979dac] hover:bg-[#16213f] hover:text-slate-50"
                  }`}
                >
                  <Icon size={17} className={item.active ? "text-[#38bdf8]" : "text-[#7d8597]"} />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[#979dac]/10 bg-[#001233]/90 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#979dac]">Architecture Decision Record</p>
                <h1 className="text-lg font-bold text-slate-50 sm:text-xl">ADR-001 — Design System Dark-First</h1>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex h-9 items-center gap-2 rounded-xl border border-[#979dac]/10 bg-[#070f22] px-3 text-sm text-[#5c677d]">
                  <Search size={15} />
                  Buscar componente...
                </div>
                <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#979dac]/15 bg-[#0b1328] px-3 text-sm font-medium text-slate-100 hover:bg-[#16213f]">
                  <Download size={15} /> Exportar
                </button>
                <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#0466c8] bg-[#0466c8] px-3 text-sm font-semibold text-white hover:bg-[#0353a4]">
                  <Plus size={15} /> Novo ticket
                </button>
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#979dac]/10 bg-[#0b1328] text-amber-300">
                  <Bell size={16} />
                </div>
              </div>
            </div>
          </header>

          <div className="px-5 py-8 lg:px-8">
            <section className="mb-8 overflow-hidden rounded-3xl border border-[#979dac]/15 bg-[linear-gradient(135deg,rgba(4,102,200,.22),rgba(0,18,51,.85)_48%,rgba(51,65,92,.22))] p-6 shadow-[0_16px_48px_rgba(0,0,0,.36)] lg:p-8">
              <div className="max-w-4xl">
                <Badge className="border-[#0466c8]/30 bg-[#0466c8]/15 text-sky-200">Status: Aceito</Badge>
                <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-50 md:text-4xl">
                  Cores, tipografia, componentes e padrões visuais para uma interface SaaS escura e profissional.
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#cbd5e1]">
                  Este preview transforma a ADR em uma referência visual navegável: paleta, escala tipográfica, cards,
                  badges, botões, tabelas, inputs e padrões de layout inspirados nos dashboards enviados.
                </p>
              </div>
            </section>

            <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Abertos" value="2" icon={Ticket} tone="green" />
              <MetricCard title="Em andamento" value="2" icon={Clock3} tone="amber" />
              <MetricCard title="Resolvidos" value="2" icon={CheckCircle2} tone="blue" />
              <MetricCard title="Urgentes" value="1" icon={AlertTriangle} tone="red" />
            </section>

            <div className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
              <Card className="p-6">
                <SectionTitle icon={Palette} title="Paleta de cores" description="Tokens primitivos e papel semântico recomendado para cada cor." />
                <div className="grid gap-3 sm:grid-cols-2">
                  {colors.map(([name, hex, use]) => (
                    <div key={hex} className="flex items-center gap-3 rounded-2xl border border-[#979dac]/10 bg-[#101a33] p-3">
                      <div className="h-12 w-12 shrink-0 rounded-xl border border-white/10" style={{ backgroundColor: hex }} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-50">{name}</p>
                        <p className="font-mono text-xs text-[#979dac]">{hex}</p>
                        <p className="mt-1 text-xs text-[#7d8597]">{use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle icon={Type} title="Escala tipográfica Inter" description="Hierarquia oficial para títulos, textos e metadados de interface." />
                <div className="space-y-3">
                  {typeScale.map(([token, size, weight, use]) => (
                    <div key={token} className="rounded-2xl border border-[#979dac]/10 bg-[#101a33] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-50" style={{ fontSize: token === "H1" ? 28 : token === "H2" ? 24 : token === "H3" ? 21 : token === "H4" ? 18 : 14, fontWeight: Number(weight.split(" / ")[0]) || 600 }}>
                          {token}
                        </p>
                        <Badge className="border-[#979dac]/15 bg-[#0b1328] text-[#979dac]">{size}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-[#979dac]">Peso {weight} · {use}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <section className="mt-8 grid gap-8 xl:grid-cols-[.9fr_1.1fr]">
              <Card className="p-6">
                <SectionTitle icon={Component} title="Componentes base" description="Exemplos de botões, badges, inputs e estados de interface." />

                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#979dac]">Botões</p>
                    <div className="flex flex-wrap gap-3">
                      <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#0466c8] bg-[#0466c8] px-4 text-sm font-semibold text-white hover:bg-[#0353a4]">
                        <Plus size={16} /> Primário
                      </button>
                      <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#979dac]/15 bg-[#0b1328] px-4 text-sm font-medium text-slate-100 hover:bg-[#16213f]">
                        Secundário
                      </button>
                      <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-transparent bg-transparent px-4 text-sm font-medium text-[#979dac] hover:bg-[#16213f] hover:text-slate-50">
                        Ghost
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#979dac]">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {statusBadges.map((badge) => (
                        <Badge key={badge.label} className={badge.cls}>{badge.label}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#979dac]">Input</p>
                    <div className="flex h-10 items-center gap-2 rounded-xl border border-[#979dac]/15 bg-[#070f22] px-3 text-sm text-[#5c677d] ring-[#0466c8]/20 transition focus-within:border-[#0466c8] focus-within:ring-4">
                      <Search size={16} />
                      <span>Buscar por ticket, cliente ou status...</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#0466c8]/20 bg-[#0466c8]/10 p-4">
                    <p className="text-sm font-semibold text-sky-200">Regra visual</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#cbd5e1]">
                      Azul vivo deve indicar ação, foco ou destaque. Superfícies devem permanecer discretas para preservar leitura.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden">
                <div className="border-b border-[#979dac]/10 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-50">Atividade recente</h2>
                      <p className="mt-1 text-sm text-[#979dac]">Padrão de tabela/lista para dashboards operacionais.</p>
                    </div>
                    <button className="inline-flex items-center gap-1 text-sm font-medium text-[#38bdf8] hover:text-sky-200">
                      Ver todos <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#979dac]/10 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#979dac]">
                        <th className="px-6 py-4">Código</th>
                        <th className="px-6 py-4">Título</th>
                        <th className="px-6 py-4">Responsável</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#979dac]/10">
                      {[
                        ["SD-101", "Cannot log in from mobile app", "Diego Ramos", "Em andamento", statusBadges[1].cls],
                        ["SD-102", "Export to CSV missing columns", "Diego Ramos", "Aberto", statusBadges[0].cls],
                        ["SD-103", "Billing invoice shows wrong VAT", "Patrícia Silva", "Em andamento", statusBadges[1].cls],
                        ["SD-145", "Dashboard charts not loading", "Diego Ramos", "Resolvido", statusBadges[2].cls],
                      ].map(([code, title, owner, status, cls]) => (
                        <tr key={code} className="transition hover:bg-[#979dac]/[0.04]">
                          <td className="px-6 py-4 font-mono text-xs text-[#7d8597]">{code}</td>
                          <td className="px-6 py-4 font-medium text-slate-100">{title}</td>
                          <td className="px-6 py-4 text-[#979dac]">{owner}</td>
                          <td className="px-6 py-4"><Badge className={cls}>{status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            <section className="mt-8 grid gap-8 lg:grid-cols-3">
              <Card className="p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold text-slate-50">Tokens CSS recomendados</h2>
                <p className="mt-1 text-sm text-[#979dac]">Base para implementação em React, Next.js, Tailwind ou CSS puro.</p>
                <pre className="mt-5 overflow-x-auto rounded-2xl border border-[#979dac]/10 bg-[#070f22] p-4 text-xs leading-relaxed text-[#cbd5e1]">
{`:root {
  --font-family-base: "Inter", system-ui, sans-serif;
  --brand-500: #0466c8;
  --brand-600: #0353a4;
  --brand-700: #023e7d;
  --brand-900: #001845;
  --brand-950: #001233;
  --bg-app: #001233;
  --bg-sidebar: #001845;
  --bg-surface: #0b1328;
  --bg-surface-2: #101a33;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #979dac;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}`}
                </pre>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-50">Decisão final</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#cbd5e1]">
                  O produto adotará um design system dark-first, com azul profundo como base, superfícies elevadas, bordas sutis,
                  ações em Smart Blue e tipografia Inter.
                </p>
                <div className="mt-5 rounded-2xl border border-[#979dac]/10 bg-[#101a33] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#979dac]">Componentes obrigatórios</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#cbd5e1]">
                    <li>• AppShell com sidebar fixa</li>
                    <li>• Cards de métrica</li>
                    <li>• Botões primário, secundário e ghost</li>
                    <li>• Badges semânticos</li>
                    <li>• Tabelas e listas operacionais</li>
                  </ul>
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
