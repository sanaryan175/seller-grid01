import React, { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  LayoutDashboard, MessageSquare, Sparkles, Package, Bell, FileText,
  Settings, ChevronDown, Search, Filter, Star, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, AlertTriangle, Flame, Send, Plug, ArrowUpRight,
  ArrowDownRight, X, SlidersHorizontal
} from "lucide-react";

// ---------- Design tokens ----------
const C = {
  bg: "#0F1216",
  surface: "#171B21",
  surfaceRaised: "#1D222A",
  border: "#262C35",
  borderLight: "#323a46",
  text: "#EDEFF2",
  textMuted: "#9BA3AF",
  textFaint: "#666E7A",
  amber: "#E8A23D",
  amberDim: "#E8A23D22",
  green: "#4ADE80",
  greenDim: "#4ADE8022",
  red: "#F0635A",
  redDim: "#F0635A22",
  blue: "#5B9BD9",
};

const FONT_DISPLAY = "'Newsreader', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

// ---------- Mock data ----------
const sentimentTrend = [
  { month: "Jan", positive: 68, neutral: 20, negative: 12 },
  { month: "Feb", positive: 71, neutral: 18, negative: 11 },
  { month: "Mar", positive: 65, neutral: 19, negative: 16 },
  { month: "Apr", positive: 74, neutral: 16, negative: 10 },
  { month: "May", positive: 78, neutral: 14, negative: 8 },
  { month: "Jun", positive: 82, neutral: 12, negative: 6 },
];

const platformData = [
  { platform: "Amazon", reviews: 8000, rating: 4.5, sentiment: "Positive", color: C.green },
  { platform: "Flipkart", reviews: 3000, rating: 4.1, sentiment: "Mixed", color: C.amber },
  { platform: "Shopify", reviews: 1500, rating: 4.7, sentiment: "Positive", color: C.green },
  { platform: "Google Reviews", reviews: 1040, rating: 4.0, sentiment: "Mixed", color: C.amber },
];

const reviews = [
  { id: 1, rating: 5, text: "Product quality is amazing but delivery was late to my city.", product: "Nike Air Max", platform: "Amazon", sentiment: "Positive", topics: ["Quality", "Delivery"], emotion: "Happy", date: "2 hours ago" },
  { id: 2, rating: 2, text: "Size runs way smaller than the chart says. Had to return it.", product: "Classic Hoodie", platform: "Flipkart", sentiment: "Negative", topics: ["Size", "Fit"], emotion: "Frustrated", date: "5 hours ago" },
  { id: 3, rating: 4, text: "Packaging was excellent, felt premium. Slight delay in shipping though.", product: "Running Shoes X", platform: "Shopify", sentiment: "Positive", topics: ["Packaging", "Delivery"], emotion: "Satisfied", date: "1 day ago" },
  { id: 4, rating: 1, text: "Customer support never responded to my refund request for 2 weeks.", product: "Summer Jacket", platform: "Amazon", sentiment: "Negative", topics: ["Support", "Refund"], emotion: "Angry", date: "1 day ago" },
  { id: 5, rating: 5, text: "Best pair of jeans I've owned. Fit is perfect, fabric is soft.", product: "Slim Jeans", platform: "Google Reviews", sentiment: "Positive", topics: ["Quality", "Fit"], emotion: "Happy", date: "2 days ago" },
  { id: 6, rating: 3, text: "Decent product but the color looked different from the photos.", product: "Nike Air Max", platform: "Flipkart", sentiment: "Neutral", topics: ["Quality"], emotion: "Indifferent", date: "2 days ago" },
];

const topicBubbles = [
  { topic: "Quality", count: 2840, x: 30, y: 35, sentiment: "positive" },
  { topic: "Delivery", count: 1920, x: 65, y: 25, sentiment: "negative" },
  { topic: "Size", count: 1240, x: 50, y: 60, sentiment: "negative" },
  { topic: "Price", count: 980, x: 78, y: 55, sentiment: "neutral" },
  { topic: "Packaging", count: 1450, x: 25, y: 70, sentiment: "positive" },
  { topic: "Support", count: 760, x: 70, y: 78, sentiment: "negative" },
];

const ratingBreakdown = [
  { star: "5★", pct: 70 },
  { star: "4★", pct: 20 },
  { star: "3★", pct: 5 },
  { star: "2★", pct: 3 },
  { star: "1★", pct: 2 },
];

const productIssues = [
  { problem: "Size mismatch", mentions: 540, impact: "High" },
  { problem: "Delivery delay", mentions: 320, impact: "Medium" },
  { problem: "Color variance", mentions: 110, impact: "Low" },
];

const alerts = [
  { id: 1, type: "spike", title: "Negative spike detected", product: "Summer Jacket", reason: "500 customers complained about zipper quality in the last 48 hours.", time: "Today, 9:14 AM" },
  { id: 2, type: "viral", title: "Trending complaint", product: "Multiple SKUs", reason: '"Wrong size delivered" mentioned 700 times this week, up 4x from baseline.', time: "Today, 6:02 AM" },
  { id: 3, type: "spike", title: "Rating drop on Flipkart", product: "Classic Hoodie", reason: "Average rating fell from 4.4 to 3.8 over 7 days.", time: "Yesterday" },
];

const integrations = [
  { name: "Amazon", connected: true },
  { name: "Flipkart", connected: false },
  { name: "Shopify", connected: true },
  { name: "Google Reviews", connected: false },
  { name: "App Store", connected: false },
];

const chatExamples = [
  "Why did ratings drop this month?",
  "Which product has the most complaints?",
  "Summarize customer feedback",
  "What should we improve first?",
];

// ---------- Small shared components ----------
function Stars({ n, size = 13 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= n ? C.amber : "transparent"} color={i <= n ? C.amber : C.textFaint} />
      ))}
    </span>
  );
}

function SentimentBadge({ s }) {
  const map = {
    Positive: { bg: C.greenDim, fg: C.green },
    Negative: { bg: C.redDim, fg: C.red },
    Neutral: { bg: C.amberDim, fg: C.amber },
    Mixed: { bg: C.amberDim, fg: C.amber },
  };
  const c = map[s] || map.Neutral;
  return (
    <span style={{ background: c.bg, color: c.fg, fontSize: 11, fontFamily: FONT_MONO, padding: "3px 8px", borderRadius: 4, letterSpacing: 0.3, textTransform: "uppercase" }}>
      {s}
    </span>
  );
}

function TopicChip({ label, positive }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12,
      background: C.surfaceRaised, border: `1px solid ${C.border}`, borderRadius: 20,
      padding: "4px 10px", color: C.textMuted, marginRight: 6, marginBottom: 6
    }}>
      {positive ? <CheckCircle2 size={12} color={C.green} /> : null}
      {label}
    </span>
  );
}

function Card({ children, style, ...props }) {
  return (
    <div
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: C.textFaint, marginBottom: 12 }}>
      {children}
    </div>
  );
}

// ---------- Top Nav ----------
function TopNav({ brand, setBrand, dateRange, setDateRange, platformFilter, setPlatformFilter }) {
  const [brandOpen, setBrandOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [platOpen, setPlatOpen] = useState(false);
  const brands = ["Nike India", "Adidas India", "Puma India"];
  const dates = ["Last 7 days", "Last 30 days", "Custom range"];
  const plats = ["All Platforms", "Amazon", "Flipkart", "Shopify", "Google Reviews", "App Store"];

  return (
    <div style={{
      height: 60, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center",
      padding: "0 24px", gap: 16, background: C.bg, position: "sticky", top: 0, zIndex: 20
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={14} color="#0F1216" />
        </div>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.text }}>Echo</span>
      </div>

      <Dropdown label={brand} open={brandOpen} setOpen={setBrandOpen} options={brands} onSelect={setBrand} />
      <div style={{ width: 1, height: 22, background: C.border }} />
      <Dropdown label={dateRange} open={dateOpen} setOpen={setDateOpen} options={dates} onSelect={setDateRange} icon />
      <Dropdown label={platformFilter} open={platOpen} setOpen={setPlatOpen} options={plats} onSelect={setPlatformFilter} icon />

      <div style={{ flex: 1 }} />

      <div style={{ position: "relative" }}>
        <Search size={14} color={C.textFaint} style={{ position: "absolute", left: 10, top: 9 }} />
        <input
          placeholder="Search reviews, products..."
          style={{
            width: 240, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7,
            padding: "7px 10px 7px 30px", color: C.text, fontSize: 13, outline: "none", fontFamily: FONT_BODY
          }}
        />
      </div>
      <div style={{ position: "relative" }}>
        <Bell size={18} color={C.textMuted} />
        <div style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, borderRadius: 99, background: C.red }} />
      </div>
      <div style={{ width: 30, height: 30, borderRadius: 99, background: C.surfaceRaised, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.textMuted, fontFamily: FONT_MONO }}>
        SK
      </div>
    </div>
  );
}

function Dropdown({ label, open, setOpen, options, onSelect, icon }) {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6, background: "transparent",
          border: "none", color: C.text, fontSize: 13, fontFamily: FONT_BODY, cursor: "pointer", padding: "6px 4px"
        }}
      >
        {icon && <SlidersHorizontal size={12} color={C.textFaint} />}
        {label}
        <ChevronDown size={13} color={C.textFaint} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 36, left: 0, background: C.surfaceRaised, border: `1px solid ${C.border}`,
          borderRadius: 8, minWidth: 180, zIndex: 30, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", overflow: "hidden"
        }}>
          {options.map((o) => (
            <div
              key={o}
              onClick={() => { onSelect(o); setOpen(false); }}
              style={{ padding: "9px 14px", fontSize: 13, color: C.text, cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.background = C.surface}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Sidebar ----------
function Sidebar({ page, setPage }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "insights", label: "AI Insights", icon: Sparkles },
    { id: "products", label: "Products", icon: Package },
    { id: "chat", label: "Ask AI", icon: MessageSquare },
    { id: "alerts", label: "Alerts", icon: Bell, badge: 3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Integrations", icon: Settings },
  ];
  return (
    <div style={{ width: 200, borderRight: `1px solid ${C.border}`, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 2, background: C.bg }}>
      {items.map((it) => {
        const Icon = it.icon;
        const active = page === it.id;
        return (
          <div
            key={it.id}
            onClick={() => setPage(it.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 7,
              cursor: "pointer", background: active ? C.surfaceRaised : "transparent",
              color: active ? C.text : C.textMuted, fontSize: 13.5, fontFamily: FONT_BODY,
              borderLeft: active ? `2px solid ${C.amber}` : "2px solid transparent"
            }}
          >
            <Icon size={16} />
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.badge && (
              <span style={{ background: C.red, color: "#fff", fontSize: 10, borderRadius: 99, padding: "1px 6px", fontFamily: FONT_MONO }}>
                {it.badge}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- KPI Card ----------
function KPICard({ label, value, sub, trend, trendUp, accent }) {
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: C.textFaint, fontFamily: FONT_MONO, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: accent || C.text, marginBottom: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12.5, color: C.textMuted, marginBottom: trend ? 8 : 0 }}>{sub}</div>}
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: trendUp ? C.green : C.red }}>
          {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trend}
        </div>
      )}
    </Card>
  );
}

// ---------- PAGE: Dashboard ----------
function DashboardPage() {
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.text, margin: 0 }}>Overview</h1>
        <p style={{ color: C.textMuted, fontSize: 13.5, marginTop: 4 }}>12,540 reviews tracked across 4 platforms this period.</p>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPICard label="Total Reviews" value="12,540" trend="18% vs last month" trendUp />
        <KPICard label="Average Rating" value="4.3" sub="out of 5 stars" accent={C.amber} />
        <KPICard label="Sentiment Score" value="82%" sub="positive · 12% neutral · 6% negative" accent={C.green} />
        <KPICard label="Response Rate" value="76%" trend="4% vs last month" trendUp />
        <KPICard label="AI Detected Issues" value="34" sub="recurring problems flagged" accent={C.red} />
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <SectionLabel>Sentiment trend</SectionLabel>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.textMuted }}>
            <span style={{ color: C.green }}>● Positive reviews increasing</span>
            <span style={{ color: C.red }}>● Negative spikes flagged</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={sentimentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="month" stroke={C.textFaint} tick={{ fontSize: 12, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
            <YAxis stroke={C.textFaint} tick={{ fontSize: 12, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.surfaceRaised, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="positive" stroke={C.green} strokeWidth={2.5} dot={false} name="Positive %" />
            <Line type="monotone" dataKey="negative" stroke={C.red} strokeWidth={2} dot={false} name="Negative %" />
            <Line type="monotone" dataKey="neutral" stroke={C.textFaint} strokeWidth={1.5} dot={false} name="Neutral %" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionLabel>Platform performance</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 6 }}>
          {platformData.map((p) => (
            <div key={p.platform} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 110, fontSize: 13, color: C.text }}>{p.platform}</div>
              <div style={{ width: 70, fontSize: 12.5, color: C.textMuted, fontFamily: FONT_MONO }}>{p.reviews.toLocaleString()}</div>
              <div style={{ width: 70 }}><Stars n={Math.round(p.rating)} /></div>
              <div style={{ flex: 1, height: 6, background: C.surfaceRaised, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(p.reviews / 8000) * 100}%`, height: "100%", background: p.color }} />
              </div>
              <div style={{ width: 80 }}><SentimentBadge s={p.sentiment} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------- PAGE: Reviews Explorer ----------
function ReviewsPage() {
  const [ratingFilter, setRatingFilter] = useState([]);
  const [sentFilter, setSentFilter] = useState([]);

  const toggle = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const filtered = reviews.filter((r) => {
    if (ratingFilter.length && !ratingFilter.includes(r.rating)) return false;
    if (sentFilter.length && !sentFilter.includes(r.sentiment)) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: 230, borderRight: `1px solid ${C.border}`, padding: 20, overflowY: "auto" }}>
        <SectionLabel>Rating</SectionLabel>
        {[5, 4, 3, 2, 1].map((n) => (
          <div key={n} onClick={() => toggle(ratingFilter, setRatingFilter, n)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer", opacity: ratingFilter.length && !ratingFilter.includes(n) ? 0.4 : 1 }}>
            <input type="checkbox" checked={ratingFilter.includes(n)} readOnly />
            <Stars n={n} />
          </div>
        ))}

        <div style={{ height: 20 }} />
        <SectionLabel>Sentiment</SectionLabel>
        {["Positive", "Neutral", "Negative"].map((s) => (
          <div key={s} onClick={() => toggle(sentFilter, setSentFilter, s)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer", fontSize: 13, color: C.textMuted }}>
            <input type="checkbox" checked={sentFilter.includes(s)} readOnly />
            {s}
          </div>
        ))}

        <div style={{ height: 20 }} />
        <SectionLabel>Product</SectionLabel>
        {["Shoes", "T-Shirts", "Bags", "Jeans"].map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: C.textMuted }}>
            <input type="checkbox" /> {p}
          </div>
        ))}

        <div style={{ height: 20 }} />
        <SectionLabel>Platform</SectionLabel>
        {["Amazon", "Flipkart", "Google", "Shopify"].map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: C.textMuted }}>
            <input type="checkbox" defaultChecked /> {p}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.text, margin: 0 }}>Reviews Explorer</h1>
          <div style={{ fontSize: 13, color: C.textMuted, fontFamily: FONT_MONO }}>{filtered.length} of {reviews.length} shown</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((r) => (
            <Card key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <Stars n={r.rating} size={15} />
                <span style={{ fontSize: 12, color: C.textFaint, fontFamily: FONT_MONO }}>{r.date}</span>
              </div>
              <p style={{ fontSize: 14.5, color: C.text, lineHeight: 1.5, margin: "0 0 14px 0" }}>"{r.text}"</p>
              <div style={{ display: "flex", gap: 24, fontSize: 12.5, color: C.textMuted, marginBottom: 12 }}>
                <span><strong style={{ color: C.textFaint }}>Product</strong> · {r.product}</span>
                <span><strong style={{ color: C.textFaint }}>Platform</strong> · {r.platform}</span>
                <span><strong style={{ color: C.textFaint }}>Emotion</strong> · {r.emotion}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <SentimentBadge s={r.sentiment} />
                  {r.topics.map((t) => <TopicChip key={t} label={t} positive={r.sentiment === "Positive"} />)}
                </div>
                <button style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
                  View full review
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- PAGE: AI Insights ----------
function InsightsPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.text, margin: 0 }}>What customers are saying</h1>
        <p style={{ color: C.textMuted, fontSize: 13.5, marginTop: 4 }}>AI-generated summary from 12,540 reviews this period.</p>
      </div>

      <div style={{ display: "flex", gap: 18 }}>
        <Card style={{ flex: 1, borderColor: C.green + "44" }}>
          <SectionLabel>Customers love</SectionLabel>
          {["Comfortable material", "Packaging quality", "Product design", "True-to-size fit on jeans"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", fontSize: 14, color: C.text }}>
              <CheckCircle2 size={15} color={C.green} /> {t}
            </div>
          ))}
        </Card>
        <Card style={{ flex: 1, borderColor: C.red + "44" }}>
          <SectionLabel>Customers dislike</SectionLabel>
          {["Late delivery", "Size mismatch on hoodies", "Slow customer support response", "Color accuracy in photos"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", fontSize: 14, color: C.text }}>
              <XCircle size={15} color={C.red} /> {t}
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <SectionLabel>Topic clustering — click a topic to drill in</SectionLabel>
        <div style={{ position: "relative", height: 280, marginTop: 10 }}>
          {topicBubbles.map((b) => {
            const size = 40 + b.count / 50;
            const color = b.sentiment === "positive" ? C.green : b.sentiment === "negative" ? C.red : C.amber;
            return (
              <div
                key={b.topic}
                onClick={() => setSelectedTopic(b.topic)}
                style={{
                  position: "absolute", left: `${b.x}%`, top: `${b.y}%`, width: size, height: size,
                  borderRadius: "50%", background: color + "22", border: `1.5px solid ${color}`,
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  transform: "translate(-50%,-50%)", transition: "transform 0.15s", flexDirection: "column"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.08)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translate(-50%,-50%)"}
              >
                <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{b.topic}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {selectedTopic && (
        <Card style={{ borderColor: C.amber + "55" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionLabel>Drill-in · {selectedTopic}</SectionLabel>
            <X size={16} color={C.textFaint} style={{ cursor: "pointer" }} onClick={() => setSelectedTopic(null)} />
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.text, marginBottom: 14 }}>
            {topicBubbles.find(b => b.topic === selectedTopic)?.count.toLocaleString()} reviews mention "{selectedTopic}"
          </div>
          <div style={{ display: "flex", gap: 30 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 8, fontFamily: FONT_MONO, textTransform: "uppercase" }}>Common phrases</div>
              <p style={{ fontSize: 13.5, color: C.textMuted, lineHeight: 1.7 }}>"Runs smaller than expected" · "Size chart inaccurate" · "Had to exchange for a bigger size"</p>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 8, fontFamily: FONT_MONO, textTransform: "uppercase" }}>Affected products</div>
              <p style={{ fontSize: 13.5, color: C.textMuted, lineHeight: 1.7 }}>Classic Hoodie · Slim Jeans · Track Pants</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------- PAGE: Products ----------
function ProductsPage() {
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.text, margin: 0 }}>Running Shoes X</h1>
          <p style={{ color: C.textMuted, fontSize: 13.5, marginTop: 4 }}>3,400 reviews · 4.2 average rating</p>
        </div>
        <Stars n={4} size={20} />
      </div>

      <div style={{ display: "flex", gap: 18 }}>
        <Card style={{ flex: 1 }}>
          <SectionLabel>Rating breakdown</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {ratingBreakdown.map((r) => (
              <div key={r.star} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, fontSize: 12.5, color: C.textMuted, fontFamily: FONT_MONO }}>{r.star}</div>
                <div style={{ flex: 1, height: 8, background: C.surfaceRaised, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${r.pct}%`, height: "100%", background: C.amber }} />
                </div>
                <div style={{ width: 36, fontSize: 12.5, color: C.textMuted, textAlign: "right" }}>{r.pct}%</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ flex: 1 }}>
          <SectionLabel>Product issues</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {productIssues.map((p) => (
              <div key={p.problem} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 14, color: C.text }}>{p.problem}</div>
                  <div style={{ fontSize: 12, color: C.textFaint, fontFamily: FONT_MONO }}>{p.mentions} mentions</div>
                </div>
                <span style={{
                  fontSize: 11, fontFamily: FONT_MONO, padding: "3px 9px", borderRadius: 4, textTransform: "uppercase",
                  color: p.impact === "High" ? C.red : p.impact === "Medium" ? C.amber : C.textMuted,
                  background: p.impact === "High" ? C.redDim : p.impact === "Medium" ? C.amberDim : C.surfaceRaised
                }}>{p.impact}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------- PAGE: AI Chat ----------
function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Ask me anything about your reviews — trends, problem products, or what to fix first." }
  ]);
  const [input, setInput] = useState("");

  const respond = (q) => {
    setMessages((m) => [...m, { role: "user", text: q }]);
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: "ai",
        text: "Most negative sentiment this month came from:\n1. Summer Jacket — zipper quality (500+ mentions)\n2. Delivery delays — Amazon, Flipkart\n3. Refund response time — support team\n\nFixing zipper QA on Summer Jacket would resolve the single largest cluster of complaints."
      }]);
    }, 600);
    setInput("");
  };

  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", height: "100%", maxWidth: 760 }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: C.text, margin: "0 0 4px 0" }}>Ask AI</h1>
      <p style={{ color: C.textMuted, fontSize: 13.5, marginBottom: 18 }}>Natural language answers, grounded in your review data.</p>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "12px 16px", borderRadius: 10, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line",
              background: m.role === "user" ? C.amberDim : C.surface,
              border: `1px solid ${m.role === "user" ? C.amber + "44" : C.border}`,
              color: C.text
            }}>
              {m.role === "ai" && <Sparkles size={13} color={C.amber} style={{ marginBottom: 6 }} />}
              <div>{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {chatExamples.map((q) => (
          <button key={q} onClick={() => respond(q)} style={{
            fontSize: 12, color: C.textMuted, background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: "6px 12px", cursor: "pointer"
          }}>{q}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && input.trim() && respond(input)}
          placeholder="Why are customers unhappy this month?"
          style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", color: C.text, fontSize: 14, outline: "none" }}
        />
        <button onClick={() => input.trim() && respond(input)} style={{ background: C.amber, border: "none", borderRadius: 8, padding: "0 16px", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Send size={16} color="#0F1216" />
        </button>
      </div>
    </div>
  );
}

// ---------- PAGE: Alerts ----------
function AlertsPage() {
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.text, margin: 0 }}>Alerts</h1>
      {alerts.map((a) => (
        <Card key={a.id} style={{ borderColor: C.red + "33" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: C.redDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {a.type === "viral" ? <Flame size={17} color={C.red} /> : <AlertTriangle size={17} color={C.red} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: C.textFaint, fontFamily: FONT_MONO }}>{a.time}</div>
              </div>
              <div style={{ fontSize: 12.5, color: C.textFaint, margin: "4px 0 8px 0" }}>Product · {a.product}</div>
              <div style={{ fontSize: 13.5, color: C.textMuted, lineHeight: 1.5 }}>{a.reason}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---------- PAGE: Reports ----------
function ReportsPage() {
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 700 }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.text, margin: 0 }}>Reports</h1>
      <Card>
        <SectionLabel>Monthly report — June 2026</SectionLabel>
        <ul style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.9, paddingLeft: 18, margin: "10px 0 20px 0" }}>
          <li>Sentiment overview &amp; trend</li>
          <li>Top customer complaints</li>
          <li>Best performing products</li>
          <li>Worst performing products</li>
          <li>AI recommendations for next month</li>
        </ul>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ background: C.amber, color: "#0F1216", border: "none", borderRadius: 7, padding: "10px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Generate report</button>
          <button style={{ background: "transparent", color: C.text, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>Export PDF</button>
          <button style={{ background: "transparent", color: C.text, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>Export CSV</button>
        </div>
      </Card>
    </div>
  );
}

// ---------- PAGE: Settings / Integrations ----------
function SettingsPage() {
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, maxWidth: 700 }}>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.text, margin: 0 }}>Integrations</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {integrations.map((i) => (
          <Card key={i.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Plug size={16} color={C.textFaint} />
              <span style={{ fontSize: 14.5, color: C.text }}>{i.name}</span>
            </div>
            <button style={{
              fontSize: 12.5, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontFamily: FONT_MONO,
              background: i.connected ? C.greenDim : C.amber, color: i.connected ? C.green : "#0F1216",
              border: i.connected ? `1px solid ${C.green}44` : "none"
            }}>
              {i.connected ? "Connected" : "Connect"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Root App ----------
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [brand, setBrand] = useState("Nike India");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [platformFilter, setPlatformFilter] = useState("All Platforms");

  const pages = {
    dashboard: <DashboardPage />,
    reviews: <ReviewsPage />,
    insights: <InsightsPage />,
    products: <ProductsPage />,
    chat: <ChatPage />,
    alerts: <AlertsPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.bg, color: C.text, height: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; font-family: inherit; }
        input[type="checkbox"] { accent-color: ${C.amber}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
      <TopNav brand={brand} setBrand={setBrand} dateRange={dateRange} setDateRange={setDateRange} platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar page={page} setPage={setPage} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          {pages[page]}
        </div>
      </div>
    </div>
  );
}