/**
 * ============================================================
 * ALIGN PRO 3D — app.js
 * Componente React Principal
 *
 * Depende de (carregados antes pelo index.html):
 *   window.ALIGNMENT_DB   → db.js
 *   window.BRANDS         → db.js
 *   window.ACTIVE_SERVICES → services.js
 *   window.SERVICES_MAP   → services.js
 *   window.StorageManager → storage.js
 * ============================================================
 */

const { useState, useEffect, useCallback, useMemo, useRef } = React;

// ── Utils ──────────────────────────────────────────────────
const fmt   = v  => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const nowStr= () => new Date().toLocaleDateString("pt-BR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" });
const uid   = () => Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase();

// ── Design tokens ──────────────────────────────────────────
const C = {
  bg:"#07090f", card:"#0c0f1a", cardAlt:"#0f1320",
  border:"#ffffff0d", amber:"#d97706", amberL:"#f59e0b",
  cyan:"#22d3ee", green:"#10b981", purple:"#8b5cf6",
  red:"#f87171", blue:"#3b82f6"
};
const inp = { background:"#ffffff07", border:`1px solid ${C.border}`, borderRadius:8, color:"#e8e8e8", padding:"10px 14px", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:"inherit", transition:"border .15s" };
const lbl = { fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:4, display:"block" };
const Btn = (c=C.amber, e={}) => ({ background:c, border:"none", borderRadius:8, color:"#fff", padding:"11px 22px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:.5, transition:"opacity .15s", ...e });

// ── Sub-components ─────────────────────────────────────────

function Badge({ s }) {
  const m = { pending:["#f59e0b","⏳ Aguardando"], approved:["#10b981","✅ Aprovado"], cancelled:["#ef4444","❌ Cancelado"] };
  const [c, t] = m[s] || ["#666", s];
  return <span style={{ background:c+"22", color:c, border:`1px solid ${c}44`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{t}</span>;
}

function SpecRow({ label, value, hi }) {
  return (
    <div style={{ background:hi?"#22d3ee08":"#ffffff04", border:`1px solid ${hi?"#22d3ee20":"#fff1"}`, borderRadius:8, padding:"8px 12px", flex:1, minWidth:130 }}>
      <div style={{ fontSize:10, color:"#444", textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:14, fontFamily:"monospace", fontWeight:700, color:hi?C.cyan:"#ddd" }}>{value}</div>
    </div>
  );
}

function SpecBlock({ v }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, flexWrap:"wrap" }}>
        <span style={{ background:"#22d3ee12", border:"1px solid #22d3ee28", borderRadius:6, padding:"3px 10px", fontSize:11, color:C.cyan }}>
          📡 Fonte: wlmedeiros.blogspot.com
        </span>
        {v.url && v.url !== "https://wlmedeiros.blogspot.com/" &&
          <a href={v.url} target="_blank" rel="noreferrer" style={{ color:C.cyan, fontSize:11 }}>↗ post original</a>
        }
        <span style={{ marginLeft:"auto", background:"#f59e0b14", color:C.amberL, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, border:`1px solid #f59e0b22` }}>Aro {v.aro}"</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <div style={{ background:"linear-gradient(135deg,#030e1c,#051828)", border:"1px solid #22d3ee1c", borderRadius:12, padding:14 }}>
          <div style={{ color:C.cyan, fontWeight:700, fontSize:11, marginBottom:10, letterSpacing:1 }}>🔵 DIANTEIRO</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            <SpecRow label="Conv. mm (total)" value={v.front.convMm} hi />
            <SpecRow label="Conv. graus"      value={v.front.convGrau} />
            <SpecRow label="Câmber"           value={v.front.camber} hi />
            <SpecRow label="Cáster"           value={v.front.caster} />
          </div>
        </div>
        <div style={{ background:"linear-gradient(135deg,#0a031c,#0e0526)", border:"1px solid #8b5cf61c", borderRadius:12, padding:14 }}>
          <div style={{ color:"#a78bfa", fontWeight:700, fontSize:11, marginBottom:10, letterSpacing:1 }}>🟣 TRASEIRO</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            <SpecRow label="Conv. mm (total)" value={v.rear.convMm} />
            <SpecRow label="Conv. graus"      value={v.rear.convGrau} />
            <SpecRow label="Câmber"           value={v.rear.camber} />
            <SpecRow label="Cáster"           value="N/A (eixo fixo)" />
          </div>
        </div>
      </div>
      <div style={{ background:"#052e16", border:"1px solid #10b98118", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#6ee7b7", lineHeight:1.8 }}>
        <b style={{ color:C.green }}>ℹ️ COMO LER:</b> Convergência total (2 rodas). Ex: <b>+1,42 (±) 1,77</b> → mín: <b>-0,35 mm</b> · ideal: <b>+1,42 mm</b> · máx: <b>+3,19 mm</b>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position:"fixed", top:16, right:16, zIndex:9999,
      background:toast.type==="err"?"#450a0a":"#022c22",
      border:`1px solid ${toast.type==="err"?"#f8717140":"#10b98140"}`,
      borderRadius:10, padding:"10px 16px", color:"#e0e0e0", fontSize:13,
      fontWeight:600, boxShadow:"0 8px 24px #0009",
      animation:"fadeIn .2s ease" }}>
      {toast.msg}
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────
const TAB_LIST = [
  { id:"search",  icon:"🔍", label:"Consultar"   },
  { id:"budget",  icon:"💰", label:"Orçamento"   },
  { id:"history", icon:"📂", label:"Histórico"   },
  { id:"dash",    icon:"📊", label:"Dashboard"   },
];

// ── Main App ─────────────────────────────────────────────
function App() {
  /* ---- storage ---- */
  const [storageLabel, setStorageLabel] = useState("⏳ Iniciando...");
  /* ---- navigation ---- */
  const [tab,    setTab]    = useState("search");
  const [bStep,  setBStep]  = useState(1);   // budget wizard step
  /* ---- search ---- */
  const [query,  setQuery]  = useState("");
  const [fBrand, setFBrand] = useState("");
  const [picked, setPicked] = useState(null);  // vehicle chosen for specs
  /* ---- budget form ---- */
  const [selVeh,    setSelVeh]    = useState(null);
  const [client,    setClient]    = useState("");
  const [phone,     setPhone]     = useState("");
  const [plate,     setPlate]     = useState("");
  const [km,        setKm]        = useState("");
  const [obs,       setObs]       = useState("");
  const [discount,  setDiscount]  = useState(0);
  const [selSvc,    setSelSvc]    = useState([]);
  /* ---- data ---- */
  const [budgets,   setBudgets]   = useState([]);
  const [current,   setCurrent]   = useState(null);
  const [viewB,     setViewB]     = useState(null);
  const [toast,     setToast]     = useState(null);
  const [stats,     setStats]     = useState(null);
  const [saving,    setSaving]    = useState(false);

  const showToast = (msg, type="ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  /* ---- init storage ---- */
  useEffect(() => {
    (async () => {
      const info = await window.StorageManager.init();
      setStorageLabel(info.label);
      const list = await window.StorageManager.loadBudgets();
      setBudgets(list);
      const st = await window.StorageManager.loadStats();
      if (st) setStats(st);
    })();
  }, []);

  /* ---- persist ---- */
  const persist = useCallback(async (list) => {
    setSaving(true);
    try {
      await window.StorageManager.saveBudgets(list);
      const st = await window.StorageManager.loadStats();
      if (st) setStats(st);
      showToast(window.StorageManager.isCloud() ? "☁️ Salvo na nuvem!" : "💾 Salvo localmente!");
    } catch (e) {
      showToast("⚠️ Erro ao salvar", "err");
    } finally { setSaving(false); }
  }, []);

  /* ---- search filter ---- */
  const filtered = useMemo(() => {
    let r = window.ALIGNMENT_DB;
    if (fBrand) r = r.filter(v => v.brand === fBrand);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(v => (v.brand + " " + v.model + " " + v.year).toLowerCase().includes(q));
    }
    return r;
  }, [query, fBrand]);

  /* ---- budget math ---- */
  const subtotal  = selSvc.reduce((s,id) => { const sv = window.SERVICES_MAP[id]; return s + (sv ? sv.price : 0); }, 0);
  const totalFmt  = subtotal - subtotal * discount / 100;

  const toggleSvc = id => setSelSvc(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  /* ---- generate budget ---- */
  const genBudget = () => {
    if (!client.trim())    { showToast("⚠️ Informe o nome do cliente", "err"); return; }
    if (!selSvc.length)    { showToast("⚠️ Selecione ao menos 1 serviço", "err"); return; }
    if (!selVeh)           { showToast("⚠️ Nenhum veículo selecionado", "err"); return; }
    const b = {
      id: uid(), date: nowStr(), client, phone,
      vehicle: { brand:selVeh.brand, model:selVeh.model, year:selVeh.year, aro:selVeh.aro, plate, km },
      specs: { front:selVeh.front, rear:selVeh.rear, url:selVeh.url },
      services: selSvc.map(id => window.SERVICES_MAP[id]),
      subtotal, discount, total:totalFmt, obs,
      status: "pending"
    };
    setCurrent(b);
    const upd = [b, ...budgets];
    setBudgets(upd);
    persist(upd);
    setBStep(3);
  };

  /* ---- actions ---- */
  const approveBudget = id => {
    const upd = budgets.map(b => b.id === id ? { ...b, status:"approved" } : b);
    setBudgets(upd); persist(upd);
    if (viewB?.id === id) setViewB({ ...viewB, status:"approved" });
    if (current?.id === id) setCurrent({ ...current, status:"approved" });
    showToast("✅ Orçamento aprovado!");
  };
  const cancelBudget = id => {
    const upd = budgets.map(b => b.id === id ? { ...b, status:"cancelled" } : b);
    setBudgets(upd); persist(upd);
    showToast("❌ Orçamento cancelado");
  };
  const deleteBudget = id => {
    const upd = budgets.filter(b => b.id !== id);
    setBudgets(upd); persist(upd); setViewB(null);
    showToast("🗑️ Excluído");
  };
  const resetForm = () => {
    setClient(""); setPhone(""); setPlate(""); setKm(""); setObs("");
    setDiscount(0); setSelSvc([]); setCurrent(null); setSelVeh(null);
    setBStep(1); setTab("search");
  };
  const startBudget = v => { setSelVeh(v); setBStep(1); setTab("budget"); };

  /* ── RENDER ───────────────────────────────────────────── */
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:"#e0e0e0", fontFamily:"'Rajdhani',sans-serif" }}>

      {/* HEADER */}
      <div className="no-print" style={{ background:"linear-gradient(135deg,#07090f,#0e1422)", borderBottom:"1px solid #d9770616", padding:"12px 16px", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" }}>
        <div style={{ width:42, height:42, background:"linear-gradient(135deg,#d97706,#f59e0b)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 0 18px #d9770640", flexShrink:0 }}>🎯</div>
        <div>
          <div className="orb" style={{ fontSize:15, fontWeight:900, color:C.amberL, letterSpacing:2 }}>ALIGN PRO 3D</div>
          <div style={{ fontSize:10, color:"#444", letterSpacing:1 }}>BASE WLMEDEIROS.BLOGSPOT.COM · {window.ALIGNMENT_DB.length} VEÍCULOS</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ background: window.StorageManager.isCloud() ? "#22d3ee14":"#10b98112", border:`1px solid ${window.StorageManager.isCloud()?"#22d3ee28":"#10b98122"}`, borderRadius:20, padding:"4px 12px", fontSize:11, color: window.StorageManager.isCloud()?C.cyan:C.green }}>
            {saving ? "⏳ Salvando..." : storageLabel}
          </span>
          <span style={{ fontSize:11, color:"#444", background:"#ffffff08", padding:"4px 12px", borderRadius:20 }}>📋 {budgets.length}</span>
          <button onClick={() => window.StorageManager.exportJSON(budgets)} style={Btn("#1e3a5f",{fontSize:11,padding:"5px 10px"})}>⬇️ Export</button>
          <label style={{ ...Btn("#2d1b69",{fontSize:11,padding:"5px 10px"}), cursor:"pointer" }}>
            ⬆️ Import
            <input type="file" accept=".json" style={{ display:"none" }} onChange={e => {
              window.StorageManager.importJSON(e.target.files[0],
                list => { setBudgets(list); persist(list); showToast(`✅ ${list.length} importados!`); },
                err  => showToast("⚠️ " + err, "err")
              );
              e.target.value = "";
            }}/>
          </label>
        </div>
      </div>

      <Toast toast={toast} />

      {/* TABS */}
      <div className="no-print" style={{ display:"flex", borderBottom:"1px solid #ffffff0a" }}>
        {TAB_LIST.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background:tab===t.id?"#d9770610":"transparent", borderBottom:tab===t.id?"2px solid #d97706":"2px solid transparent", color:tab===t.id?"#f59e0b":"#555", border:"none", padding:"11px 18px", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit", letterSpacing:.5, whiteSpace:"nowrap" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"16px 14px" }}>

        {/* ════════ TAB: SEARCH ════════ */}
        {tab === "search" && (
          <div style={{ animation:"fadeIn .25s ease" }}>
            <div className="orb" style={{ fontSize:11, color:C.amberL, marginBottom:14, letterSpacing:2 }}>🔍 CONSULTA DE SPECS — BANCO WLMEDEIROS</div>
            <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
              <input style={{ ...inp, flex:"1 1 200px" }} value={query} onChange={e=>setQuery(e.target.value)} placeholder="🔍 Buscar marca, modelo ou ano..." />
              <select style={{ ...inp, flex:"0 0 195px" }} value={fBrand} onChange={e=>setFBrand(e.target.value)}>
                <option value="">Todas as marcas ({window.BRANDS.length})</option>
                {window.BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <span style={{ alignSelf:"center", fontSize:11, color:"#444" }}>{filtered.length} / {window.ALIGNMENT_DB.length}</span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
              {filtered.map((v, i) => {
                const isSel = picked?.brand===v.brand && picked?.model===v.model && picked?.year===v.year;
                return (
                  <div key={i} onClick={() => setPicked(isSel ? null : v)}
                    style={{ background:isSel?"#d9770610":C.card, border:`1px solid ${isSel?"#d97706":"#ffffff0d"}`, borderRadius:12, padding:14, cursor:"pointer", transition:"all .15s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:15 }}>{v.brand}</div>
                        <div style={{ fontSize:13, color:"#777" }}>{v.model} · {v.year}</div>
                      </div>
                      <span style={{ background:"#f59e0b12", color:C.amberL, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, border:"1px solid #f59e0b22", height:"fit-content" }}>Aro {v.aro}</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, fontSize:11, marginBottom:isSel?10:0 }}>
                      {[["Conv.D",v.front.convMm],["Câmber D",v.front.camber],["Cáster",v.front.caster],["Câmber T",v.rear.camber]].map(([l,val])=>(
                        <div key={l} style={{ background:"#ffffff04", borderRadius:5, padding:"4px 8px" }}>
                          <div style={{ color:"#444", fontSize:10 }}>{l}</div>
                          <div style={{ color:"#ccc", fontFamily:"monospace", fontWeight:700 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    {isSel && (
                      <button onClick={e => { e.stopPropagation(); startBudget(v); }}
                        style={{ ...Btn(C.amber,{width:"100%",fontSize:12,padding:"8px"}), marginTop:4 }}>
                        💰 FAZER ORÇAMENTO
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {picked && (
              <div style={{ marginTop:18, background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
                  <div>
                    <div style={{ fontWeight:900, fontSize:18 }}>{picked.brand} {picked.model}</div>
                    <div style={{ fontSize:13, color:"#666" }}>Ano: {picked.year} · Aro: {picked.aro}"</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={Btn()} onClick={() => startBudget(picked)}>💰 ORÇAR</button>
                    <button style={Btn("#334155",{padding:"11px 14px"})} onClick={() => setPicked(null)}>✕</button>
                  </div>
                </div>
                <SpecBlock v={picked} />
              </div>
            )}
          </div>
        )}

        {/* ════════ TAB: BUDGET ════════ */}
        {tab === "budget" && (
          <div style={{ animation:"fadeIn .25s ease" }}>
            <div className="orb" style={{ fontSize:11, color:C.amberL, marginBottom:14, letterSpacing:2 }}>💰 GERAR ORÇAMENTO</div>

            {/* Wizard progress */}
            <div className="no-print" style={{ display:"flex", marginBottom:18 }}>
              {["1 · Veículo & Dados","2 · Serviços","3 · Orçamento Final"].map((s,i) => {
                const n = i + 1;
                const done = bStep > n, active = bStep === n;
                return (
                  <div key={i} style={{ flex:1, padding:"8px 10px", textAlign:"center", fontSize:12, fontWeight:700,
                    background:active?"#d9770612":done?"#10b98110":"#ffffff04",
                    borderBottom:`2px solid ${active?"#d97706":done?"#10b981":"#ffffff10"}`,
                    color:active?"#f59e0b":done?"#10b981":"#555",
                    borderRadius:i===0?"8px 0 0 0":i===2?"0 8px 0 0":"0" }}>
                    {done?"✓ ":""}{s}
                  </div>
                );
              })}
            </div>

            {/* STEP 1 */}
            {bStep === 1 && !selVeh && (
              <div style={{ textAlign:"center", padding:60, color:"#444" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🚗</div>
                <div style={{ marginBottom:14 }}>Selecione um veículo na aba Consultar</div>
                <button style={Btn()} onClick={() => setTab("search")}>🔍 CONSULTAR SPECS</button>
              </div>
            )}

            {bStep === 1 && selVeh && (
              <div>
                <div style={{ background:"#d9770610", border:"1px solid #d97706", borderRadius:10, padding:14, marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:C.amberL }}>🚗 {selVeh.brand} {selVeh.model} {selVeh.year} — Aro {selVeh.aro}"</div>
                </div>
                <SpecBlock v={selVeh} />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:14 }}>
                  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                    <div style={{ fontWeight:700, color:C.amberL, marginBottom:12, fontSize:13 }}>👤 CLIENTE</div>
                    <div style={{ marginBottom:10 }}><label style={lbl}>Nome *</label><input style={inp} value={client} onChange={e=>setClient(e.target.value)} placeholder="Nome completo" /></div>
                    <div style={{ marginBottom:10 }}><label style={lbl}>Telefone</label><input style={inp} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(00) 00000-0000" /></div>
                    <div><label style={lbl}>Observações</label><textarea style={{ ...inp, height:60, resize:"vertical" }} value={obs} onChange={e=>setObs(e.target.value)} placeholder="Reclamações, notas..." /></div>
                  </div>
                  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                    <div style={{ fontWeight:700, color:C.amberL, marginBottom:12, fontSize:13 }}>📋 VEÍCULO</div>
                    <div style={{ marginBottom:10 }}><label style={lbl}>Placa</label><input style={inp} value={plate} onChange={e=>setPlate(e.target.value.toUpperCase())} placeholder="ABC-1D23" maxLength={8} /></div>
                    <div><label style={lbl}>KM Atual</label><input style={inp} value={km} onChange={e=>setKm(e.target.value)} placeholder="45.000" /></div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, marginTop:12 }}>
                  <button style={Btn("#334155")} onClick={() => { setTab("search"); }}>← Trocar</button>
                  <button style={Btn()} onClick={() => { if (!client.trim()) { showToast("⚠️ Informe o nome","err"); return; } setBStep(2); }}>PRÓXIMO →</button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {bStep === 2 && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10, marginBottom:16 }}>
                  {window.ACTIVE_SERVICES.map(sv => {
                    const sel = selSvc.includes(sv.id);
                    return (
                      <div key={sv.id} onClick={() => toggleSvc(sv.id)}
                        style={{ background:sel?"#d9770612":"#ffffff04", border:`1px solid ${sel?"#d97706":"#ffffff0d"}`, borderRadius:10, padding:13, cursor:"pointer", transition:"all .15s", position:"relative" }}>
                        {sel && <div style={{ position:"absolute", top:8, right:10, color:C.amber, fontWeight:900, fontSize:17 }}>✓</div>}
                        <div style={{ fontSize:22, marginBottom:5 }}>{sv.icon}</div>
                        <div style={{ fontWeight:700, fontSize:13, marginBottom:4, paddingRight:20 }}>{sv.name}</div>
                        <div style={{ fontSize:11, color:"#555", marginBottom:6 }}>{sv.desc}</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ color:C.green, fontWeight:700, fontSize:15 }}>{fmt(sv.price)}</span>
                          <span style={{ color:"#444", fontSize:11 }}>⏱ {sv.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ background:C.bg, border:`1px solid ${C.amber}`, borderRadius:10, padding:14, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                    <div>
                      <div style={{ color:"#555", fontSize:12 }}>{selSvc.length} serviço(s) · {selVeh?.brand} {selVeh?.model}</div>
                      <div className="orb" style={{ color:C.amberL, fontSize:20, fontWeight:900 }}>{fmt(totalFmt)}</div>
                      {discount > 0 && <div style={{ fontSize:11, color:C.green }}>Economia: {fmt(subtotal - totalFmt)}</div>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <label style={{ ...lbl, marginBottom:0 }}>Desconto %</label>
                      <input type="number" style={{ ...inp, width:68 }} value={discount}
                        onChange={e => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))} min={0} max={100} />
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button style={Btn("#334155")} onClick={() => setBStep(1)}>← VOLTAR</button>
                  <button style={Btn()} onClick={genBudget}>💰 GERAR ORÇAMENTO →</button>
                </div>
              </div>
            )}

            {/* STEP 3 — budget print view */}
            {bStep === 3 && current && (
              <div>
                <div className="print-card" style={{ background:"linear-gradient(135deg,#09122a,#080b11)", border:`1px solid ${C.amber}`, borderRadius:14, padding:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18, flexWrap:"wrap", gap:10 }}>
                    <div>
                      <div className="orb" style={{ fontSize:17, fontWeight:900, color:C.amberL }}>ALIGN PRO 3D</div>
                      <div style={{ fontSize:10, color:"#555", letterSpacing:1 }}>ORÇAMENTO DE SERVIÇOS AUTOMOTIVOS</div>
                      <div style={{ fontSize:11, color:"#666", marginTop:3 }}>Nº {current.id} · {current.date}</div>
                    </div>
                    <Badge s={current.status} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                    {[
                      ["👤 CLIENTE",  [current.client, current.phone && `📱 ${current.phone}`]],
                      ["🚗 VEÍCULO",  [`${current.vehicle.brand} ${current.vehicle.model} ${current.vehicle.year}`, [current.vehicle.plate&&`🪪 ${current.vehicle.plate}`, current.vehicle.km&&`🛣 ${current.vehicle.km} km`].filter(Boolean).join(" · ")]],
                    ].map(([t,ls]) => (
                      <div key={t} style={{ background:"#ffffff04", borderRadius:8, padding:12 }}>
                        <div style={{ fontSize:11, color:C.amberL, fontWeight:700, marginBottom:6, letterSpacing:1 }}>{t}</div>
                        {ls.filter(Boolean).map((l,i) => <div key={i} style={{ fontSize:i===0?14:12, fontWeight:i===0?700:400, color:i===0?"#e0e0e0":"#888" }}>{l}</div>)}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, color:C.amberL, fontWeight:700, marginBottom:8, letterSpacing:1 }}>🛠️ SERVIÇOS</div>
                    {current.services.map(sv => (
                      <div key={sv.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #ffffff07", fontSize:13 }}>
                        <span>{sv.icon} {sv.name} <span style={{ color:"#444", fontSize:11 }}>· {sv.time}</span></span>
                        <span style={{ color:C.green, fontWeight:700 }}>{fmt(sv.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"#ffffff04", borderRadius:8, padding:12, marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13 }}><span style={{ color:"#888" }}>Subtotal</span><span>{fmt(current.subtotal)}</span></div>
                    {current.discount > 0 && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:13 }}><span style={{ color:C.red }}>Desconto ({current.discount}%)</span><span style={{ color:C.red }}>- {fmt(current.subtotal * current.discount / 100)}</span></div>}
                    <div className="orb" style={{ display:"flex", justifyContent:"space-between", fontSize:17, fontWeight:900, color:C.amberL }}><span>TOTAL</span><span>{fmt(current.total)}</span></div>
                  </div>
                  <div style={{ background:"#22d3ee08", border:"1px solid #22d3ee1e", borderRadius:8, padding:12, marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ fontSize:11, color:C.cyan, fontWeight:700, letterSpacing:1 }}>📐 SPECS 3D — WLMEDEIROS.BLOGSPOT.COM</div>
                      {current.specs.url !== "https://wlmedeiros.blogspot.com/" &&
                        <a href={current.specs.url} target="_blank" rel="noreferrer" style={{ fontSize:10, color:C.cyan }}>↗ fonte</a>
                      }
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:6, fontSize:11, color:"#888" }}>
                      {[["Conv. D (mm)",current.specs.front.convMm],["Câmber D",current.specs.front.camber],["Cáster",current.specs.front.caster],["Conv. T (mm)",current.specs.rear.convMm],["Câmber T",current.specs.rear.camber],["Aro",`${current.vehicle.aro}"`]].map(([l,v]) => (
                        <span key={l}>{l}: <b style={{ color:"#ccc" }}>{v}</b></span>
                      ))}
                    </div>
                  </div>
                  {current.obs && <div style={{ background:"#ffffff04", borderRadius:7, padding:10, fontSize:12, color:"#888" }}><b style={{ color:C.amberL }}>📝 OBS:</b> {current.obs}</div>}
                </div>
                <div className="no-print" style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
                  {current.status === "pending" && <button style={Btn(C.green)} onClick={() => approveBudget(current.id)}>✅ APROVAR</button>}
                  <button style={Btn(C.blue)} onClick={() => window.print()}>🖨️ IMPRIMIR</button>
                  <button style={Btn()} onClick={() => setTab("history")}>📂 HISTÓRICO</button>
                  <button style={Btn("#334155")} onClick={resetForm}>➕ NOVO</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ TAB: HISTORY ════════ */}
        {tab === "history" && (
          <div style={{ animation:"fadeIn .25s ease" }}>
            <div className="orb" style={{ fontSize:11, color:"#a78bfa", marginBottom:14, letterSpacing:2 }}>📂 HISTÓRICO — {budgets.length} ORÇAMENTO(S)</div>
            {budgets.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, color:"#444" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                <button style={Btn()} onClick={() => setTab("search")}>🔍 CONSULTAR SPECS</button>
              </div>
            ) : (
              <div style={{ display:"flex", gap:14 }}>
                <div style={{ flex:1 }}>
                  {budgets.map(b => (
                    <div key={b.id} onClick={() => setViewB(viewB?.id===b.id ? null : b)}
                      style={{ background:viewB?.id===b.id?"#d9770610":"#ffffff04", border:`1px solid ${viewB?.id===b.id?"#d97706":"#ffffff0d"}`, borderRadius:10, padding:14, marginBottom:8, cursor:"pointer", transition:"all .15s" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14 }}>{b.client}</div>
                          <div style={{ fontSize:12, color:"#777" }}>🚗 {b.vehicle.brand} {b.vehicle.model} {b.vehicle.year}{b.vehicle.plate&&` · ${b.vehicle.plate}`}</div>
                          <div style={{ fontSize:11, color:"#444", marginTop:3 }}>{b.date} · #{b.id}</div>
                          <div style={{ marginTop:5, display:"flex", gap:4, flexWrap:"wrap" }}>
                            {b.services.slice(0,3).map(s=><span key={s.id} style={{ fontSize:10, background:"#ffffff07", borderRadius:4, padding:"1px 6px", color:"#777" }}>{s.icon} {s.name}</span>)}
                            {b.services.length>3 && <span style={{ fontSize:10, color:"#444" }}>+{b.services.length-3}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div className="orb" style={{ color:C.amberL, fontWeight:900, fontSize:13 }}>{fmt(b.total)}</div>
                          <div style={{ marginTop:4 }}><Badge s={b.status} /></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {viewB && (
                  <div style={{ width:290, background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:12, padding:16, position:"sticky", top:80, height:"fit-content" }}>
                    <div className="orb" style={{ fontSize:11, color:C.amberL, marginBottom:10 }}>#{viewB.id}</div>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:3 }}>{viewB.client}</div>
                    {viewB.phone && <div style={{ fontSize:12, color:"#777", marginBottom:6 }}>📱 {viewB.phone}</div>}
                    <div style={{ fontSize:13, color:"#888", marginBottom:10 }}>🚗 {viewB.vehicle.brand} {viewB.vehicle.model} {viewB.vehicle.year}</div>
                    <div style={{ marginBottom:10 }}>
                      {viewB.services.map(s => (
                        <div key={s.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#999", padding:"4px 0", borderBottom:"1px solid #ffffff06" }}>
                          <span>{s.icon} {s.name}</span><span>{fmt(s.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="orb" style={{ fontWeight:900, color:C.amberL, fontSize:15, marginBottom:8 }}>{fmt(viewB.total)}</div>
                    <Badge s={viewB.status} />
                    <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:10 }}>
                      {viewB.status === "pending"    && <button style={Btn(C.green,{fontSize:12,padding:"8px"})}   onClick={() => approveBudget(viewB.id)}>✅ Aprovar</button>}
                      {viewB.status !== "cancelled"  && <button style={Btn("#7c3aed",{fontSize:12,padding:"8px"})} onClick={() => cancelBudget(viewB.id)}>❌ Cancelar</button>}
                      <button style={Btn(C.blue,{fontSize:12,padding:"8px"})} onClick={() => { setCurrent(viewB); setBStep(3); setTab("budget"); }}>👁️ Ver Orçamento</button>
                      <button style={Btn("#7f1d1d",{fontSize:12,padding:"8px"})} onClick={() => deleteBudget(viewB.id)}>🗑️ Excluir</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════ TAB: DASHBOARD ════════ */}
        {tab === "dash" && (
          <div style={{ animation:"fadeIn .25s ease" }}>
            <div className="orb" style={{ fontSize:11, color:C.cyan, marginBottom:14, letterSpacing:2 }}>📊 DASHBOARD</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12, marginBottom:20 }}>
              {[
                ["📋 Total",      budgets.length,                                                    C.amberL],
                ["⏳ Pendentes",  budgets.filter(b=>b.status==="pending").length,                    "#f59e0b"],
                ["✅ Aprovados",  budgets.filter(b=>b.status==="approved").length,                   C.green],
                ["💰 Faturado",   fmt(budgets.filter(b=>b.status==="approved").reduce((s,b)=>s+b.total,0)), C.cyan],
              ].map(([l,v,c]) => (
                <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18, textAlign:"center" }}>
                  <div style={{ fontSize:12, color:"#555", marginBottom:8 }}>{l}</div>
                  <div className="orb" style={{ fontSize:22, fontWeight:900, color:c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
                <div style={{ fontWeight:700, color:C.amberL, marginBottom:12, fontSize:13 }}>🏆 TOP SERVIÇOS</div>
                {window.ACTIVE_SERVICES.slice(0,6).map(sv => {
                  const count = budgets.filter(b => b.services.some(s => s.id===sv.id)).length;
                  const pct = budgets.length ? Math.round(count/budgets.length*100) : 0;
                  return (
                    <div key={sv.id} style={{ marginBottom:8 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                        <span>{sv.icon} {sv.name}</span>
                        <span style={{ color:C.amberL }}>{count}x</span>
                      </div>
                      <div style={{ background:"#ffffff08", borderRadius:4, height:4 }}>
                        <div style={{ background:C.amber, borderRadius:4, height:4, width:`${pct}%`, transition:"width .5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
                <div style={{ fontWeight:700, color:C.amberL, marginBottom:12, fontSize:13 }}>🚗 TOP MARCAS</div>
                {Object.entries(budgets.reduce((acc,b) => { acc[b.vehicle.brand] = (acc[b.vehicle.brand]||0)+1; return acc; }, {}))
                  .sort((a,b) => b[1]-a[1]).slice(0,8)
                  .map(([brand, count]) => (
                    <div key={brand} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #ffffff07", fontSize:13 }}>
                      <span>{brand}</span>
                      <span style={{ color:C.cyan, fontWeight:700 }}>{count}</span>
                    </div>
                  ))}
                {budgets.length === 0 && <div style={{ color:"#444", fontSize:12 }}>Nenhum orçamento ainda</div>}
              </div>
            </div>
            <div style={{ marginTop:12, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
              <div style={{ fontWeight:700, color:C.amberL, marginBottom:10, fontSize:13 }}>☁️ ARMAZENAMENTO</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8, fontSize:12 }}>
                {[
                  ["Modo atual", storageLabel],
                  ["Orçamentos salvos", budgets.length],
                  ["Banco de dados", `${window.ALIGNMENT_DB.length} veículos · ${window.BRANDS.length} marcas`],
                  ["Serviços ativos", window.ACTIVE_SERVICES.length],
                  ["Compatibilidade", "🐧 Linux · 🪟 Windows · 🍎 macOS"],
                  ["Fonte das specs", "wlmedeiros.blogspot.com"],
                ].map(([l,v]) => (
                  <div key={l} style={{ background:"#ffffff04", borderRadius:8, padding:"8px 12px" }}>
                    <div style={{ color:"#444", fontSize:11, marginBottom:2 }}>{l}</div>
                    <div style={{ color:"#ccc", fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="no-print" style={{ marginTop:30, padding:"12px 16px", background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:8, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, fontSize:11, color:"#333" }}>
          <span>📚 Specs: <a href="https://wlmedeiros.blogspot.com" target="_blank" rel="noreferrer" style={{ color:"#555" }}>wlmedeiros.blogspot.com</a></span>
          <span>🐧 Linux · 🪟 Windows · 🍎 macOS · 🤖 Android</span>
        </div>
      </div>
    </div>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
