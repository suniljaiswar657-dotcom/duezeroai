"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check,
  CheckCircle2, ChevronDown, CircleAlert, Clock3, FileText, Filter,
  LayoutDashboard, Plus, Search, ShieldCheck, Sparkles, Trash2, X
} from "lucide-react";

type DueItem = {
  id: string; title: string; category: string; dueDate: string;
  amount: number | null; notes: string; done: boolean; createdAt: number;
};

const starter: DueItem[] = [
  { id: "sample-1", title: "Vehicle insurance renewal", category: "Vehicle", dueDate: "2026-12-08", amount: 8400, notes: "Sample record — edit or delete this", done: false, createdAt: 1 },
  { id: "sample-2", title: "Domain name renewal", category: "Digital", dueDate: "2026-12-19", amount: 1299, notes: "Sample record — edit or delete this", done: false, createdAt: 2 },
  { id: "sample-3", title: "Shop licence renewal", category: "Business", dueDate: "2027-01-15", amount: null, notes: "Sample record — edit or delete this", done: false, createdAt: 3 }
];

const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const dayDiff = (date: string) => Math.ceil((new Date(date + "T23:59:59").getTime() - new Date().setHours(0,0,0,0)) / 86400000);
const dateLabel = (date: string) => new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Home() {
  const [items, setItems] = useState<DueItem[]>(starter);
  const [ready, setReady] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title: "", category: "Personal", dueDate: "", amount: "", notes: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("duezero-items-v1");
      if (raw) setItems(JSON.parse(raw));
    } catch { /* use starter data if local storage is unavailable */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("duezero-items-v1", JSON.stringify(items));
  }, [items, ready]);

  const active = items.filter(i => !i.done);
  const overdue = active.filter(i => dayDiff(i.dueDate) < 0);
  const upcoming = active.filter(i => dayDiff(i.dueDate) >= 0 && dayDiff(i.dueDate) <= 30);
  const total = active.reduce((sum, i) => sum + (i.amount || 0), 0);
  const filtered = useMemo(() => items.filter(i => {
    const matchesQuery = (i.title + " " + i.category + " " + i.notes).toLowerCase().includes(query.toLowerCase());
    const d = dayDiff(i.dueDate);
    const matchesFilter = filter === "All" || (filter === "Overdue" && !i.done && d < 0) || (filter === "Next 30 days" && !i.done && d >= 0 && d <= 30) || (filter === "Completed" && i.done);
    return matchesQuery && matchesFilter;
  }).sort((a,b) => a.dueDate.localeCompare(b.dueDate)), [items, query, filter]);

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2600); }
  function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    const item: DueItem = { id: crypto.randomUUID(), title: form.title.trim(), category: form.category, dueDate: form.dueDate, amount: form.amount ? Number(form.amount) : null, notes: form.notes.trim(), done: false, createdAt: Date.now() };
    setItems(prev => [...prev, item]);
    setForm({ title: "", category: "Personal", dueDate: "", amount: "", notes: "" });
    setShowForm(false); notify("Deadline added to your command center.");
  }
  function toggleDone(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
    notify("Record status updated.");
  }
  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id)); notify("Record deleted.");
  }
  async function enableNotifications() {
    if (!("Notification" in window)) { notify("This browser does not support notifications."); return; }
    const permission = await Notification.requestPermission();
    notify(permission === "granted" ? "Browser permission enabled. Reminders still need an active reminder service." : "Notification permission was not granted.");
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark"><ShieldCheck size={21}/></span><span>DUEZERO<span className="brand-ai"> AI</span><small>DEADLINE COMMAND CENTER</small></span></a>
        <div className="side-label">WORKSPACE</div>
        <a className="nav active" href="#"><LayoutDashboard size={17}/> Overview</a>
        <a className="nav" href="#deadlines"><CalendarDays size={17}/> All deadlines <span className="nav-count">{active.length}</span></a>
        <button className="nav nav-button" onClick={enableNotifications}><Bell size={17}/> Notifications</button>
        <div className="side-bottom">
          <div className="privacy-card"><div className="privacy-icon"><ShieldCheck size={17}/></div><strong>Your data stays here</strong><p>This MVP saves records in this browser only. Cloud sync is not connected.</p><span><span className="status-dot"/> LOCAL STORAGE</span></div>
          <div className="profile"><div className="avatar">DZ</div><div><strong>My workspace</strong><small>Free plan · MVP</small></div><ChevronDown size={15}/></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar"><div className="crumb">Workspace <span>/</span> Overview</div><div className="top-actions"><span className="today"><CalendarDays size={14}/>{new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span><button className="icon-btn" aria-label="Enable notifications" onClick={enableNotifications}><Bell size={18}/></button><div className="avatar small-avatar">DZ</div></div></header>
        <div className="content">
          <div className="welcome-row"><div><div className="eyebrow"><span className="pulse"/> YOUR LIFE, ON TRACK</div><h1>Never miss a <em>deadline.</em></h1><p className="subhead">One clear view of everything that needs your attention.</p></div><button className="primary-btn" onClick={() => setShowForm(true)}><Plus size={17}/> Add a deadline</button></div>

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-top"><span>Active deadlines</span><span className="stat-icon blue"><CalendarDays size={17}/></span></div><div className="stat-number">{active.length.toString().padStart(2,"0")}</div><div className="stat-foot">Across all categories</div></div>
            <div className="stat-card"><div className="stat-top"><span>Need attention</span><span className="stat-icon red"><CircleAlert size={17}/></span></div><div className="stat-number">{overdue.length.toString().padStart(2,"0")}</div><div className="stat-foot">{overdue.length ? "Past their due date" : "Nothing overdue right now"}</div></div>
            <div className="stat-card"><div className="stat-top"><span>Due in 30 days</span><span className="stat-icon amber"><Clock3 size={17}/></span></div><div className="stat-number">{upcoming.length.toString().padStart(2,"0")}</div><div className="stat-foot">Plan ahead, stay ready</div></div>
            <div className="stat-card"><div className="stat-top"><span>Upcoming amount</span><span className="stat-icon green"><Activity size={17}/></span></div><div className="stat-number money-number">{money(total)}</div><div className="stat-foot">Estimated amount on active items</div></div>
          </div>

          <div className="insight-banner"><div className="insight-symbol"><Sparkles size={19}/></div><div><strong>Your next move</strong><p>{overdue.length ? `You have ${overdue.length} overdue item${overdue.length > 1 ? "s" : ""}. Review them first.` : upcoming.length ? `${upcoming.length} deadline${upcoming.length > 1 ? "s" : ""} coming up in the next 30 days. A little planning goes a long way.` : "You're clear for now. Add your important renewals and let DUEZERO keep them visible."}</p></div><span className="insight-tag">SMART OVERVIEW</span></div>

          <section className="deadline-section" id="deadlines">
            <div className="section-heading"><div><h2>Your deadlines</h2><p>Keep every renewal and important date in one place.</p></div><button className="text-btn" onClick={() => setShowForm(true)}><Plus size={15}/> Add new</button></div>
            <div className="toolbar"><div className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search deadlines..." /></div><div className="filter-wrap"><Filter size={15}/><select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filter deadlines"><option>All</option><option>Overdue</option><option>Next 30 days</option><option>Completed</option></select></div></div>
            <div className="table-wrap"><table><thead><tr><th>DEADLINE</th><th>CATEGORY</th><th>DUE DATE</th><th>EST. AMOUNT</th><th>STATUS</th><th></th></tr></thead><tbody>
              {filtered.map(item => { const d=dayDiff(item.dueDate); const status=item.done ? "Completed" : d<0 ? "Overdue" : d===0 ? "Due today" : d<=7 ? "Due soon" : "Upcoming"; return <tr key={item.id}><td><div className="task-cell"><button className={`check-btn ${item.done?"checked":""}`} onClick={()=>toggleDone(item.id)} aria-label={item.done?"Mark active":"Mark completed"}>{item.done&&<Check size={13}/>}</button><div><strong className={item.done?"done-title":""}>{item.title}</strong>{item.notes&&<small>{item.notes}</small>}</div></div></td><td><span className="category-pill">{item.category}</span></td><td><span className="date-cell">{dateLabel(item.dueDate)}</span></td><td className="amount-cell">{item.amount===null?"—":money(item.amount)}</td><td><span className={`status status-${status.toLowerCase().replaceAll(" ","-")}`}><span/> {status}</span></td><td><button className="delete-btn" onClick={()=>removeItem(item.id)} aria-label={`Delete ${item.title}`}><Trash2 size={15}/></button></td></tr> }) }
              {filtered.length===0&&<tr><td colSpan={6}><div className="empty"><div className="empty-icon"><CalendarDays size={22}/></div><strong>No deadlines found</strong><p>{items.length===0?"Add your first renewal or important date.":"Try another search or filter."}</p><button className="text-btn" onClick={()=>{setQuery("");setFilter("All");setShowForm(true)}}><Plus size={15}/> Add a deadline</button></div></td></tr>}
            </tbody></table></div>
            <div className="table-footer"><span>Showing {filtered.length} of {items.length} records</span><span><span className="status-dot"/> Saved on this device</span></div>
          </section>
          <footer className="footer"><span>© 2026 DUEZERO AI</span><span>Stay ahead. Stay in control.</span><span>Built for fewer surprises.</span></footer>
        </div>
      </section>

      {showForm&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><section className="modal"><div className="modal-head"><div><span className="eyebrow">NEW RECORD</span><h2>Add a deadline</h2><p>Capture it now. Keep it off your mind.</p></div><button className="icon-btn" onClick={()=>setShowForm(false)} aria-label="Close"><X size={18}/></button></div><form onSubmit={addItem}><label>What do you need to remember?<input autoFocus required maxLength={90} placeholder="e.g. Health insurance renewal" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><div className="form-row"><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Personal</option><option>Vehicle</option><option>Health</option><option>Business</option><option>Finance</option><option>Digital</option><option>Government</option><option>Other</option></select></label><label>Due date<input type="date" required value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></label></div><label>Estimated amount <span className="optional">OPTIONAL · INR</span><input type="number" min="0" step="1" placeholder="e.g. 2500" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label><label>Notes <span className="optional">OPTIONAL</span><textarea rows={3} maxLength={300} placeholder="Policy number, provider or anything useful..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="primary-btn"><Plus size={16}/> Save deadline</button></div></form></section></div>}
      {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
      <div className="mobile-nav"><a className="active" href="#"><LayoutDashboard size={18}/>Home</a><a href="#deadlines"><CalendarDays size={18}/>Deadlines</a><button onClick={()=>setShowForm(true)}><Plus size={18}/>Add</button><button onClick={enableNotifications}><Bell size={18}/>Alerts</button></div>
    </main>
  );
}