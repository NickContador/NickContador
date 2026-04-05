/**
 * ============================================================
 * ALIGN PRO 3D — storage.js
 * Camada de Persistência Unificada
 *
 * ESTRATÉGIA (prioridade decrescente):
 *   1. window.storage  → API online da plataforma Claude.ai
 *                         Dados sincronizados na nuvem, persistem
 *                         entre sessões do mesmo usuário.
 *   2. localStorage    → Armazenamento local do navegador.
 *                         Funciona offline em Linux/Win/Mac/Android.
 *   3. memoryFallback  → Array em memória para ambientes sem storage.
 *                         Dados perdidos ao fechar a aba.
 *
 * USO:
 *   const sm = window.StorageManager;
 *   await sm.init();
 *   await sm.saveBudgets(list);
 *   const list = await sm.loadBudgets();
 *   sm.exportJSON(list);
 *   sm.importJSON(file, callback);
 * ============================================================
 */

window.StorageManager = (function () {

  const KEY        = "alignpro3d_budgets_v3";
  const STATS_KEY  = "alignpro3d_stats_v1";
  let   _mode      = "memory";   // "cloud" | "local" | "memory"
  let   _memFallback = [];

  // ── Detecta o modo disponível ─────────────────────────────
  async function init() {
    // Tenta window.storage (Claude.ai)
    if (window.storage && typeof window.storage.get === "function") {
      try {
        await window.storage.get(KEY, false);
        _mode = "cloud";
        console.info("[ALIGN PRO] Storage: ☁️  Claude Cloud");
        return { mode: "cloud", label: "☁️ Online (Claude Drive)" };
      } catch (_) { /* não disponível */ }
    }
    // Tenta localStorage (standalone)
    try {
      localStorage.setItem("__test__", "1");
      localStorage.removeItem("__test__");
      _mode = "local";
      console.info("[ALIGN PRO] Storage: 💾 localStorage");
      return { mode: "local", label: "💾 Local (Navegador)" };
    } catch (_) { /* bloqueado */ }
    // Fallback em memória
    _mode = "memory";
    console.warn("[ALIGN PRO] Storage: ⚠️  Memória (temporário)");
    return { mode: "memory", label: "⚠️ Memória (temporário)" };
  }

  // ── Salvar lista de orçamentos ────────────────────────────
  async function saveBudgets(list) {
    const json = JSON.stringify(list);
    if (_mode === "cloud") {
      await window.storage.set(KEY, json, false);
    } else if (_mode === "local") {
      localStorage.setItem(KEY, json);
    } else {
      _memFallback = list;
    }
    await _updateStats(list);
  }

  // ── Carregar lista de orçamentos ──────────────────────────
  async function loadBudgets() {
    try {
      if (_mode === "cloud") {
        const r = await window.storage.get(KEY, false);
        return r && r.value ? JSON.parse(r.value) : [];
      } else if (_mode === "local") {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
      } else {
        return _memFallback;
      }
    } catch (e) {
      console.error("[ALIGN PRO] Erro ao carregar:", e);
      return [];
    }
  }

  // ── Salvar / carregar estatísticas ────────────────────────
  async function _updateStats(list) {
    const stats = {
      total: list.length,
      approved: list.filter(b => b.status === "approved").length,
      revenue: list.filter(b => b.status === "approved").reduce((s, b) => s + b.total, 0),
      lastUpdate: new Date().toISOString()
    };
    try {
      if (_mode === "cloud") {
        await window.storage.set(STATS_KEY, JSON.stringify(stats), false);
      } else if (_mode === "local") {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
      }
    } catch (_) {}
  }

  async function loadStats() {
    try {
      if (_mode === "cloud") {
        const r = await window.storage.get(STATS_KEY, false);
        return r && r.value ? JSON.parse(r.value) : null;
      } else if (_mode === "local") {
        const raw = localStorage.getItem(STATS_KEY);
        return raw ? JSON.parse(raw) : null;
      }
    } catch (_) {}
    return null;
  }

  // ── Exportar JSON para arquivo ────────────────────────────
  function exportJSON(list) {
    const payload = {
      _meta: {
        app: "Align Pro 3D",
        version: "3.0",
        source: "wlmedeiros.blogspot.com",
        exported: new Date().toISOString(),
        count: list.length
      },
      budgets: list
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `alignpro3d_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Importar JSON de arquivo ──────────────────────────────
  function importJSON(file, onSuccess, onError) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        // aceita tanto array puro quanto objeto com _meta
        const list = Array.isArray(data) ? data : (data.budgets || []);
        if (!Array.isArray(list)) throw new Error("Formato inválido");
        onSuccess(list);
      } catch (e) {
        onError && onError(e.message);
      }
    };
    reader.readAsText(file);
  }

  // ── Apagar todos os dados ─────────────────────────────────
  async function clearAll() {
    if (_mode === "cloud") {
      try { await window.storage.delete(KEY, false); } catch (_) {}
      try { await window.storage.delete(STATS_KEY, false); } catch (_) {}
    } else if (_mode === "local") {
      localStorage.removeItem(KEY);
      localStorage.removeItem(STATS_KEY);
    } else {
      _memFallback = [];
    }
  }

  // ── Getters públicos ──────────────────────────────────────
  function getMode()  { return _mode; }
  function getModeLabel() {
    return { cloud: "☁️ Online", local: "💾 Local", memory: "⚠️ Memória" }[_mode];
  }
  function isCloud()  { return _mode === "cloud"; }
  function isLocal()  { return _mode === "local"; }

  // API pública
  return { init, saveBudgets, loadBudgets, loadStats, exportJSON, importJSON, clearAll, getMode, getModeLabel, isCloud, isLocal };

})();
