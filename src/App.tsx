import { useEffect, useState, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";
import { motion, useInView } from "framer-motion";
import { stats, photos, timelineEvents, petStats } from "./data";

function Counter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString("es-PE")}{suffix}</span>;
}

function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-rose-900 mb-2">{children}</h2>
      {sub && <p className="text-rose-400 text-lg">{sub}</p>}
      <div className="w-16 h-0.5 bg-rose-300 mx-auto mt-4" />
    </div>
  );
}

function LoveCard({ label, total, jesus, tita }: { label: string; total: number; jesus: number; tita: number }) {
  const titaPercent = Math.round((tita / total) * 100);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
      <p className="text-2xl font-bold text-rose-600 mb-1"><Counter end={total} /></p>
      <p className="text-sm text-gray-500 mb-3">veces dijeron {label}</p>
      <div className="flex h-2 rounded-full overflow-hidden bg-rose-100">
        <div className="bg-rose-400 transition-all" style={{ width: `${100 - titaPercent}%` }} />
        <div className="bg-pink-300 transition-all" style={{ width: `${titaPercent}%` }} />
      </div>
      <div className="flex justify-between text-xs mt-1 text-gray-400">
        <span>Jesus {jesus}</span>
        <span>Tita {tita}</span>
      </div>
    </div>
  );
}

function StatCard({ value, label, icon }: { value: string | number; label: string; icon: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center hover:shadow-md transition-shadow">
      <p className="text-3xl mb-2">{icon}</p>
      <p className="text-2xl font-bold text-rose-600">{typeof value === "number" ? <Counter end={value} /> : value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function LiveCounter() {
  const [elapsed, setElapsed] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const anniversary = new Date(2021, 4, 31);
    const tick = () => {
      const now = new Date();
      let years = now.getFullYear() - anniversary.getFullYear();
      let months = now.getMonth() - anniversary.getMonth();
      let days = now.getDate() - anniversary.getDate();
      if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
      if (months < 0) { years--; months += 12; }
      setElapsed({
        years, months, days,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { v: elapsed.years, l: "años" },
        { v: elapsed.months, l: "meses" },
        { v: elapsed.days, l: "días" },
        { v: elapsed.hours, l: "horas" },
        { v: elapsed.minutes, l: "min" },
        { v: elapsed.seconds, l: "seg" },
      ].map(({ v, l }) => (
        <div key={l} className="bg-white/80 backdrop-blur rounded-xl px-4 py-3 shadow-sm border border-rose-100 min-w-[70px]">
          <p className="text-2xl font-bold text-rose-600 font-mono">{String(v).padStart(2, "0")}</p>
          <p className="text-xs text-gray-400">{l}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const hourData = stats.byHour.map((v, i) => ({ hour: `${i}h`, msgs: v }));
  const monthlyData = stats.monthlyTimeline.map((m) => ({
    month: m.month.slice(2),
    msgs: m.total,
  }));

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-rose-50/30" />
        <div className="absolute top-10 left-10 text-6xl opacity-10 heart-float">&#10084;</div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-10 heart-float" style={{ animationDelay: "1s" }}>&#10084;</div>
        <div className="absolute top-1/3 right-1/4 text-3xl opacity-5 heart-float" style={{ animationDelay: "2s" }}>&#10084;</div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center max-w-3xl"
        >
          <div className="mb-8">
            <div className="w-40 h-40 md:w-52 md:h-52 mx-auto rounded-full overflow-hidden border-4 border-rose-200 shadow-xl pulse-soft">
              <img src={photos.hero} alt="Jesus y Tita" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-rose-400 tracking-[0.3em] uppercase text-sm mb-4">31 de mayo de 2021 — 31 de mayo de 2026</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">5 años contigo</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-8 leading-relaxed">
            <span className="font-semibold text-rose-600">{stats.totalMessages.toLocaleString("es-PE")}</span> mensajes.{" "}
            <span className="font-semibold text-rose-600">{stats.activeDays.toLocaleString("es-PE")}</span> días hablando.{" "}
            <br className="hidden md:block" />
            Una historia contada por WhatsApp.
          </p>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <p className="text-rose-300 text-2xl">&#8595;</p>
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-24 pb-24">
        {/* PRIMER MENSAJE */}
        <Section>
          <SectionTitle sub="Donde todo empezó">El primer mensaje</SectionTitle>
          <div className="max-w-lg mx-auto space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <p className="text-xs text-gray-400 mb-2">{stats.firstMessage.date}</p>
              <div className="bg-emerald-50 rounded-xl rounded-tl-none p-4 inline-block">
                <p className="text-sm font-semibold text-emerald-700 mb-1">{stats.firstMessage.sender}</p>
                <p className="text-gray-700 italic">"{stats.firstMessage.text}"</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <p className="text-xs text-gray-400 mb-2">{stats.firstTeAmo.date} — {stats.firstTeAmo.daysAfterFirst} días después</p>
              <div className="bg-rose-50 rounded-xl rounded-tl-none p-4 inline-block">
                <p className="text-sm font-semibold text-rose-600 mb-1">Primer "te amo" — {stats.firstTeAmo.sender}</p>
                <p className="text-gray-700 italic text-lg">"{stats.firstTeAmo.text}" &#10084;&#65039;</p>
              </div>
            </div>
          </div>
        </Section>

        {/* AMOR EN NUMEROS */}
        <Section>
          <SectionTitle sub="Cada palabra cuenta">Amor en números</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.loveMetrics.map((m) => (
              <LoveCard key={m.label} label={m.label} total={m.total} jesus={m.jesus} tita={m.tita} />
            ))}
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-5 text-white flex flex-col justify-center items-center">
              <p className="text-4xl font-bold"><Counter end={2195} /></p>
              <p className="text-sm opacity-90 mt-1">expresiones de amor en total</p>
            </div>
          </div>
        </Section>

        {/* TIMELINE */}
        <Section>
          <SectionTitle sub="Año por año, juntos">Línea del tiempo</SectionTitle>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-rose-200" />
            {timelineEvents.map((event, i) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex flex-col md:flex-row items-start mb-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 bg-rose-400 rounded-full border-4 border-rose-100 z-10" />
                <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <span className="inline-block bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    {event.year}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-rose-900 mb-1">{event.title}</h3>
                  <p className="text-rose-400 text-sm font-semibold mb-2">{event.msgs} mensajes</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{event.description}</p>
                  {event.highlight && (
                    <p className="text-rose-500 text-sm font-semibold mt-2">&#10024; {event.highlight}</p>
                  )}
                  {event.photo && (
                    <div className="mt-4 photo-card rounded-xl overflow-hidden shadow-md inline-block">
                      <img src={event.photo} alt={event.photoCaption} className="w-full max-w-[280px] h-auto" />
                      {event.photoCaption && (
                        <p className="text-xs text-gray-400 p-2 bg-white">{event.photoCaption}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* EVOLUTION CHART */}
        <Section>
          <SectionTitle sub="Cómo evolucionó la conversación">Mensajes por mes</SectionTitle>
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-rose-100">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorMsgs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} interval={6} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #fecdd3", fontSize: 12 }}
                  formatter={(v) => [`${Number(v).toLocaleString()} msgs`, ""]}
                />
                <Area type="monotone" dataKey="msgs" stroke="#f43f5e" fill="url(#colorMsgs)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* RECORDS */}
        <Section>
          <SectionTitle sub="Los hitos de su chat">Records y datos curiosos</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={stats.records.longestStreak.days} label="días seguidos hablando" icon="&#128293;" />
            <StatCard value={`${stats.records.mostActiveDay.messages.toLocaleString()}`} label={`msgs el ${stats.records.mostActiveDay.date}`} icon="&#128640;" />
            <StatCard value={stats.records.tiktoks} label="TikToks compartidos" icon="&#127909;" />
            <StatCard value={stats.records.laughs} label="risas (jaja, 😂, 🤣)" icon="&#128514;" />
            <StatCard value={stats.records.stickers} label="stickers enviados" icon="&#127912;" />
            <StatCard value={stats.records.photos} label="fotos compartidas" icon="&#128247;" />
            <StatCard value={stats.records.videos} label="videos enviados" icon="&#127916;" />
            <StatCard value={stats.records.lateNightMsgs} label="mensajes de madrugada" icon="&#127769;" />
          </div>
        </Section>

        {/* QUIEN HABLA MAS */}
        <Section>
          <SectionTitle sub="El balance perfecto">¿Quién habla más?</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <h3 className="font-serif text-lg font-bold text-rose-900 mb-4">Mensajes enviados</h3>
              <div className="flex items-center justify-center mb-4">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Jesus", value: stats.perPerson.Jesus.messages },
                        { name: "Tita", value: stats.perPerson.Tita.messages },
                      ]}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={80}
                      dataKey="value" startAngle={90} endAngle={-270}
                    >
                      <Cell fill="#fb7185" />
                      <Cell fill="#f9a8d4" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <span>Jesus {stats.perPerson.Jesus.percent}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-300" />
                  <span>Tita {stats.perPerson.Tita.percent}%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 space-y-6">
              <h3 className="font-serif text-lg font-bold text-rose-900">Estilo de escritura</h3>
              {(["Jesus", "Tita"] as const).map((p) => (
                <div key={p}>
                  <p className="font-semibold text-rose-700 mb-1">{p}</p>
                  <p className="text-sm text-gray-500">
                    {stats.perPerson[p].messages.toLocaleString()} mensajes &middot;{" "}
                    {stats.perPerson[p].words.toLocaleString()} palabras &middot;{" "}
                    <span className="font-semibold">{stats.perPerson[p].avgWords}</span> palabras/msg
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {p === "Tita" ? "Más expresiva, mensajes más largos" : "Más mensajes, pero más concisos"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* QUIEN ESCRIBE PRIMERO */}
        <Section>
          <SectionTitle sub="¿Quién da los buenos días?">¿Quién escribe primero?</SectionTitle>
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
            {(["Jesus", "Tita"] as const).map((p) => {
              const total = stats.whoTextsFirst.Jesus + stats.whoTextsFirst.Tita;
              const pct = Math.round((stats.whoTextsFirst[p] / total) * 100);
              return (
                <div key={p} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-rose-700">{p}</span>
                    <span className="text-gray-500">{stats.whoTextsFirst[p]} días ({pct}%)</span>
                  </div>
                  <div className="h-3 bg-rose-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full rounded-full ${p === "Jesus" ? "bg-rose-400" : "bg-pink-300"}`}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-sm text-gray-400 mt-4 text-center italic">
              Jesus suele dar los buenos días &#9728;&#65039;
            </p>
          </div>
        </Section>

        {/* RESPONSE TIME */}
        <Section>
          <SectionTitle sub="Siempre atentos">Tiempo de respuesta</SectionTitle>
          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
            {(["Jesus", "Tita"] as const).map((p) => (
              <div key={p} className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center">
                <p className="text-3xl font-bold text-rose-600">{stats.responseTime[p].avgMin} min</p>
                <p className="text-sm text-gray-500">promedio de {p}</p>
                <p className="text-xs text-gray-400 mt-1">mediana: {stats.responseTime[p].medianSec}s</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-4 italic">
            Están tan sincronizados que responden casi al mismo tiempo
          </p>
        </Section>

        {/* HORARIO */}
        <Section>
          <SectionTitle sub="¿A qué hora hablan más?">Su horario favorito</SectionTitle>
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-rose-100">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourData}>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #fecdd3", fontSize: 12 }}
                  formatter={(v) => [`${Number(v).toLocaleString()} msgs`, ""]}
                />
                <Bar dataKey="msgs" radius={[4, 4, 0, 0]}>
                  {hourData.map((_, i) => (
                    <Cell key={i} fill={i >= 11 && i <= 16 ? "#f43f5e" : "#fecdd3"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-400 text-center mt-2">
              Pico entre <span className="font-semibold text-rose-500">11am y 4pm</span> &middot; Los fines de semana chatean menos — se ven en persona
            </p>
          </div>
        </Section>

        {/* EMOJIS */}
        <Section>
          <SectionTitle sub="Los más usados">Top Emojis</SectionTitle>
          <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
            {stats.topEmojis.map((e, i) => (
              <motion.div
                key={e.emoji}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100 text-center min-w-[80px]"
              >
                <p className="text-3xl mb-1">{e.emoji}</p>
                <p className="text-xs text-gray-400">{e.count.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* YEARLY CHART */}
        <Section>
          <SectionTitle sub="La evolución año a año">Mensajes por año</SectionTitle>
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-rose-100">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.yearly}>
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #fecdd3", fontSize: 12 }}
                  formatter={(v, name) => [Number(v).toLocaleString(), name === "jesus" ? "Jesus" : "Tita"]}
                />
                <Bar dataKey="jesus" stackId="a" fill="#fb7185" radius={[0, 0, 0, 0]} name="jesus" />
                <Bar dataKey="tita" stackId="a" fill="#f9a8d4" radius={[4, 4, 0, 0]} name="tita" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 text-sm mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="text-gray-500">Jesus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-300" />
                <span className="text-gray-500">Tita</span>
              </div>
            </div>
          </div>
        </Section>

        {/* COMO CAMBIARON */}
        <Section>
          <SectionTitle sub="Vivir juntos cambió cómo hablan">La evolución de su lenguaje</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <h3 className="font-serif text-lg font-bold text-rose-900 mb-4">2020 — A distancia</h3>
              <div className="space-y-3 text-sm text-gray-500">
                <p>&#128172; Jesus: <span className="font-semibold text-rose-600">3.6</span> palabras/msg</p>
                <p>&#128172; Tita: <span className="font-semibold text-rose-600">4.7</span> palabras/msg</p>
                <p>&#128248; <span className="font-semibold">2,267</span> fotos compartidas</p>
                <p className="text-xs text-gray-400 italic mt-2">Mensajes cortos y frecuentes. Todo pasa por el chat.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <h3 className="font-serif text-lg font-bold text-rose-900 mb-4">2026 — Viviendo juntos</h3>
              <div className="space-y-3 text-sm text-gray-500">
                <p>&#128172; Jesus: <span className="font-semibold text-rose-600">3.8</span> palabras/msg</p>
                <p>&#128172; Tita: <span className="font-semibold text-rose-600">6.8</span> palabras/msg &#128200;</p>
                <p>&#128248; <span className="font-semibold">764</span> fotos en 5 meses</p>
                <p className="text-xs text-gray-400 italic mt-2">Tita ahora escribe un 45% más largo. Menos mensajes, pero más profundos.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
            <h3 className="font-serif text-base font-bold text-rose-900 mb-3">&#128270; ¿Qué cambió?</h3>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>&#8226; <strong>2020-2021:</strong> Miles de mensajes diarios — la cuarentena los mantenía pegados al chat. En abril 2021 llega Bruce.</li>
              <li>&#8226; <strong>2022:</strong> Se mudan juntos en Surco. Los mensajes bajan un 79% — ahora hablan en persona.</li>
              <li>&#8226; <strong>2022-2023:</strong> Tita deja de trabajar por un tiempo. Como están juntos en casa, casi no necesitan WhatsApp.</li>
              <li>&#8226; <strong>Marzo 2024:</strong> Tita retoma en MRC (Transmeta) — la misma empresa donde Jesus trabaja remoto. Ella va presencial, él desde casa. Resultado: "La remontada" del chat.</li>
              <li>&#8226; <strong>Tita</strong> pasó de 4.7 a 6.8 palabras/msg. Ahora escribe más largo y descriptivo desde la oficina. Siempre envía más fotos, stickers y multimedia.</li>
            </ul>
          </div>
        </Section>

        {/* GALLERY */}
        <Section>
          <SectionTitle sub="Momentos que importan">Galería de recuerdos</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: photos.hero, caption: "Cumple de Tita 2022" },
              { src: photos.cenaAniversario, caption: "Aniversario 2023" },
              { src: photos.bruceCasa, caption: "Bruce en casa 2023" },
              { src: photos.cumpleFamilia, caption: "Cumple con familia 2023" },
              { src: photos.titaNavidad, caption: "Navidad 2024" },
              { src: photos.jesusCafe, caption: "En un café 2024" },
              { src: photos.titaMirror, caption: "Saliendo 2025" },
              { src: photos.nalaSofa, caption: "Nala en el sofá 2025" },
              { src: photos.titaPerro, caption: "Cenando con el bb" },
            ].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="photo-card rounded-xl overflow-hidden shadow-md"
              >
                <img src={photo.src} alt={photo.caption} className="w-full h-48 md:h-56 object-cover" loading="lazy" />
                <p className="text-xs text-gray-400 p-2 bg-white text-center">{photo.caption}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* MASCOTAS */}
        <Section>
          <SectionTitle sub="La familia creció con patitas">La familia peluda</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { name: "Bruce", emoji: "🐶", age: "5 años", mentions: petStats.bruce.mentions, photo: photos.bruceBebe, desc: "Llegó en abril de 2021. El primer hijo peludo. 807 menciones en el chat." },
              { name: "Nala", emoji: "🐱", age: "1 año", mentions: petStats.nala.mentions, photo: photos.nalaSofa, desc: "Llegó en marzo de 2025. La gatita calico que conquistó el sofá." },
              { name: "Misa", emoji: "🐱", age: "4 meses", mentions: petStats.misa.mentions, photo: photos.misaBebe, desc: "Llegó en febrero de 2026. La más pequeña de la familia." },
            ].map((pet) => (
              <div key={pet.name} className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden hover:shadow-md transition-shadow">
                {pet.photo && (
                  <img src={pet.photo} alt={pet.name} className="w-full h-48 object-cover" />
                )}
                {!pet.photo && (
                  <div className="w-full h-48 bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                    <span className="text-6xl">{pet.emoji}</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{pet.emoji}</span>
                    <h3 className="font-serif text-lg font-bold text-rose-900">{pet.name}</h3>
                    <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">{pet.age}</span>
                  </div>
                  <p className="text-sm text-gray-500">{pet.desc}</p>
                  <p className="text-xs text-rose-400 mt-2 font-semibold">{pet.mentions} menciones en el chat</p>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-md mx-auto bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100 text-center">
            <p className="text-3xl font-bold text-rose-600"><Counter end={petStats.totalPetMentions} /></p>
            <p className="text-sm text-gray-500 mt-1">menciones totales de mascotas en el chat</p>
            <p className="text-xs text-gray-400 mt-2 italic">incluyendo "perro", "michi", "gatita" y más</p>
          </div>
        </Section>

        {/* CLOSING */}
        <Section>
          <div className="text-center py-16">
            <motion.p
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="text-6xl mb-6"
            >&#10084;&#65039;</motion.p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-rose-900 mb-4">
              5 años, {stats.totalMessages.toLocaleString("es-PE")} mensajes,
              <br />y contando...
            </h2>
            <p className="text-gray-500 text-lg mb-8">Tiempo juntos desde el 31 de mayo de 2021</p>
            <LiveCounter />
            <div className="mt-12 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-100">
                <p className="font-serif text-lg text-rose-800 italic leading-relaxed">
                  "Cada mensaje fue un latido. Cada TikTok una risa compartida.
                  Cada 'te amo' un recordatorio de que esto es real.
                  Felices 5 años, mor."
                </p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <footer className="text-center py-8 text-xs text-gray-300">
        Hecho con datos reales de WhatsApp &middot; {stats.totalMessages.toLocaleString()} mensajes analizados
      </footer>
    </div>
  );
}
