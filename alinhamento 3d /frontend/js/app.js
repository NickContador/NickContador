const API = "http://localhost:8000/api";

const $ = id => document.getElementById(id);

const el = {
    select: $("seletor-veiculo"),
    btnSync: $("btn-sincronizar"),
    msg: $("mensagem-status"),
    headerSub: $("header-sub"),

    camber: {
        alvo: $("alvo-camber"), leitura: $("leitura-camber"),
        slider: $("slider-camber"), status: $("status-camber"),
        barra: $("barra-camber"), marcador: $("marcador-camber"),
        card: $("card-camber"), svg: $("svg-camber")
    },
    caster: {
        alvo: $("alvo-caster"), leitura: $("leitura-caster"),
        slider: $("slider-caster"), status: $("status-caster"),
        barra: $("barra-caster"), marcador: $("marcador-caster"),
        card: $("card-caster"), svg: $("svg-caster")
    },
    conv: {
        alvo: $("alvo-convergencia"), leitura: $("leitura-convergencia"),
        slider: $("slider-convergencia"), status: $("status-convergencia"),
        barra: $("barra-convergencia"), marcador: $("marcador-convergencia"),
        card: $("card-convergencia"), svg: $("svg-convergencia")
    },

    filtroFab: $("filtro-fabricante"),
    filtroMarca: $("filtro-marca"),
    filtroModelo: $("filtro-modelo"),
    filtroAno: $("filtro-ano"),
    btnPesquisar: $("btn-pesquisar"),
    btnLimpar: $("btn-limpar"),
    tbody: $("tbody-resultados"),
    resultadoInfo: $("resultado-info"),
    semResultados: $("sem-resultados"),

    resumoCamber: $("resumo-camber"),
    resumoCaster: $("resumo-caster"),
    resumoConv: $("resumo-convergencia"),
    badgeCamber: $("badge-camber"),
    badgeCaster: $("badge-caster"),
    badgeConv: $("badge-convergencia"),
};

let veiculoAtual = null;

const cfg = {
    camber: { min: -3, max: 3, step: 0.01, tol: 0.5, svgRotate: 5, label: "Câmber" },
    caster: { min: 0, max: 10, step: 0.01, tol: 1.0, svgRotate: 2, label: "Cáster" },
    conv: { min: -2, max: 2, step: 0.01, tol: 0.3, svgRotate: 3, label: "Convergência" },
};

document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        $(`tab-${btn.dataset.tab}`).classList.add("active");
    });
});

function extrairAlvo(str) {
    if (!str) return null;
    const m = str.match(/[+-]?\d+[°º]?\d*/);
    if (!m) return null;
    return parseFloat(m[0].replace(",", ".").replace(/[°º]/g, ""));
}

async function carregarVeiculos() {
    try {
        const r = await fetch(`${API}/veiculos/`);
        const lista = await r.json();
        el.select.innerHTML = '<option value="">Selecione um veículo...</option>';
        lista.forEach(v => {
            const opt = document.createElement("option");
            opt.value = v.id;
            const rotulo = v.fabricante
                ? `${v.fabricante} | ${v.marca} ${v.modelo} (${v.ano_inicio})`
                : `${v.marca} ${v.modelo} (${v.ano_inicio})`;
            opt.textContent = rotulo;
            el.select.appendChild(opt);
        });
    } catch {
        mostrarToast("Erro ao conectar com o servidor.", true);
    }
}

async function selecionarVeiculo(id) {
    if (!id) return;
    setAllIdle();
    try {
        const r = await fetch(`${API}/veiculos/${id}`);
        veiculoAtual = await r.json();
        const geo = veiculoAtual.geometria?.find(g => g.eixo === "Dianteiro");
        if (geo) {
            if (el.headerSub) {
                el.headerSub.textContent = veiculoAtual.fabricante
                    ? `${veiculoAtual.fabricante} | ${veiculoAtual.marca} ${veiculoAtual.modelo} (${veiculoAtual.ano_inicio})`
                    : `${veiculoAtual.marca} ${veiculoAtual.modelo} (${veiculoAtual.ano_inicio})`;
            }
            el.camber.alvo.textContent = geo.camber_nominal || "--";
            el.caster.alvo.textContent = geo.caster_nominal || "N/A";
            el.conv.alvo.textContent = geo.convergencia_nominal || "--";
            atualizarFaixa("camber", geo.camber_nominal);
            atualizarFaixa("caster", geo.caster_nominal);
            atualizarFaixa("conv", geo.convergencia_nominal);
            el.camber.slider.disabled = false;
            el.caster.slider.disabled = false;
            el.conv.slider.disabled = false;
        }
        avaliarTudo();
    } catch (e) { console.error(e); }
}

function atualizarFaixa(qual, valorNominal) {
    const c = el[qual];
    const f = cfg[qual];
    const alvo = extrairAlvo(valorNominal);
    if (alvo !== null && !isNaN(alvo)) {
        const min = Math.min(alvo - f.tol, f.min);
        const max = Math.max(alvo + f.tol, f.max);
        c.slider.min = min;
        c.slider.max = max;
        c.slider.value = alvo;
    }
}

async function sincronizar() {
    el.btnSync.disabled = true;
    el.btnSync.querySelector("span").textContent = "Sincronizando...";
    try {
        const r = await fetch(`${API}/veiculos/sincronizar`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify([])
        });
        const data = await r.json();
        if (r.ok) {
            mostrarToast(data.mensagem || "Banco sincronizado com sucesso!");
            await carregarVeiculos();
        } else {
            mostrarToast("Erro na sincronização.", true);
        }
    } catch {
        mostrarToast("Falha na sincronização.", true);
    } finally {
        el.btnSync.disabled = false;
        el.btnSync.querySelector("span").textContent = "Sincronizar";
    }
}

function mostrarToast(texto, erro = false) {
    el.msg.textContent = texto;
    el.msg.className = `toast ${erro ? "status-alerta" : "status-ok"}`;
    clearTimeout(el.msg._timer);
    el.msg._timer = setTimeout(() => { el.msg.className = "toast"; }, 5000);
}

function setAllIdle() {
    [el.camber, el.caster, el.conv].forEach(c => {
        c.status.textContent = "Aguardando";
        c.status.className = "gauge-status idle";
        c.card.className = "gauge-card card-idle";
        c.leitura.parentElement.className = "gauge-display";
        c.leitura.className = "gauge-value";
    });
    el.camber.slider.disabled = true;
    el.caster.slider.disabled = true;
    el.conv.slider.disabled = true;
    [el.resumoCamber, el.resumoCaster, el.resumoConv].forEach(r => {
        r.textContent = "--";
        r.className = "summary-value";
    });
    [el.badgeCamber, el.badgeCaster, el.badgeConv].forEach(b => {
        b.textContent = "";
        b.className = "summary-badge idle";
    });
}

function avaliar(qual) {
    const c = el[qual];
    const f = cfg[qual];
    const val = parseFloat(c.slider.value);

    c.leitura.textContent = val.toFixed(2);

    const alvo = extrairAlvo(c.alvo.textContent);
    let isOk = true;
    let statusTxt = "N/A";
    if (alvo !== null) {
        isOk = Math.abs(val - alvo) <= f.tol;
        statusTxt = isOk ? "OK" : "AJUSTE";
    }

    c.leitura.className = `gauge-value ${isOk ? "ok" : "alerta"}`;
    c.status.textContent = statusTxt;
    c.status.className = `gauge-status ${isOk ? "ok" : "alerta"}`;
    c.card.className = `gauge-card card-${isOk ? "ok" : "alerta"}`;

    const pct = ((val - parseFloat(c.slider.min)) / (parseFloat(c.slider.max) - parseFloat(c.slider.min))) * 100;
    c.marcador.style.left = `calc(${pct}% - 2px)`;
    c.barra.className = `gauge-bar-fill ${isOk ? "ok" : "alerta"}`;
    c.barra.style.width = `${Math.abs(pct)}%`;

    if (qual === "camber") {
        const g = c.svg.querySelector(".wheel-group");
        if (g) g.setAttribute("transform", `rotate(${val * f.svgRotate}, 50, 60)`);
    }
    if (qual === "caster") {
        const g = c.svg.querySelector(".wheel-group");
        if (g) g.setAttribute("transform", `rotate(${-val * f.svgRotate + 5}, 50, 60)`);
    }
    if (qual === "conv") {
        const esq = c.svg.querySelector("#conv-esq");
        const dir = c.svg.querySelector("#conv-dir");
        if (esq) esq.setAttribute("transform", `rotate(${val * f.svgRotate}, 36, 45)`);
        if (dir) dir.setAttribute("transform", `rotate(${-val * f.svgRotate}, 124, 45)`);
    }

    const resumoEl = qual === "conv" ? el.resumoConv : qual === "camber" ? el.resumoCamber : el.resumoCaster;
    const badgeEl = qual === "conv" ? el.badgeConv : qual === "camber" ? el.badgeCamber : el.badgeCaster;

    if (resumoEl) {
        resumoEl.textContent = `${val.toFixed(2)}°`;
        resumoEl.className = `summary-value ${isOk ? "ok" : "alerta"}`;
    }
    if (badgeEl) {
        badgeEl.textContent = statusTxt;
        badgeEl.className = `summary-badge ${isOk ? (alvo === null ? "idle" : "ok") : "alerta"}`;
    }

    if (qual === "camber" || qual === "caster") {
        const rodaEsq = document.querySelector("#roda-esquerda-svg circle");
        const rodaDir = document.querySelector("#roda-direita-svg circle");
        if (rodaEsq && rodaDir) {
            const cor = isOk ? "#22c55e" : "#ef4444";
            rodaEsq.setAttribute("stroke", cor);
            rodaDir.setAttribute("stroke", cor);
            rodaEsq.setAttribute("opacity", "0.6");
            rodaDir.setAttribute("opacity", "0.6");
        }
    }
}

function avaliarTudo() {
    avaliar("camber");
    avaliar("caster");
    avaliar("conv");
}

async function pesquisar() {
    const params = new URLSearchParams();
    if (el.filtroFab.value.trim()) params.set("fabricante", el.filtroFab.value.trim());
    if (el.filtroMarca.value.trim()) params.set("marca", el.filtroMarca.value.trim());
    if (el.filtroModelo.value.trim()) params.set("modelo", el.filtroModelo.value.trim());
    if (el.filtroAno.value) params.set("ano", el.filtroAno.value);

    try {
        const r = await fetch(`${API}/veiculos/?${params}`);
        const lista = await r.json();
        el.tbody.innerHTML = "";
        el.semResultados.classList.add("hidden");

        if (lista.length === 0) {
            el.semResultados.classList.remove("hidden");
            el.resultadoInfo.textContent = "";
            return;
        }

        el.resultadoInfo.textContent = `${lista.length} veículo(s) encontrado(s).`;

        lista.forEach(v => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${v.fabricante || "-"}</td>
                <td>${v.marca}</td>
                <td>${v.modelo}</td>
                <td>${v.ano_inicio}${v.ano_fim ? ` - ${v.ano_fim}` : ""}</td>
                <td><button class="btn-selecionar" data-id="${v.id}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Selecionar
                </button></td>
            `;
            el.tbody.appendChild(tr);
        });

        document.querySelectorAll(".btn-selecionar").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                el.select.value = id;
                selecionarVeiculo(id);
                document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
                document.querySelector('[data-tab="diagnostico"]').classList.add("active");
                $("tab-diagnostico").classList.add("active");
            });
        });
    } catch {
        el.resultadoInfo.textContent = "Erro na consulta.";
    }
}

function limparFiltros() {
    el.filtroFab.value = "";
    el.filtroMarca.value = "";
    el.filtroModelo.value = "";
    el.filtroAno.value = "";
    el.tbody.innerHTML = "";
    el.resultadoInfo.textContent = "";
    el.semResultados.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", carregarVeiculos);
el.select.addEventListener("change", e => selecionarVeiculo(e.target.value));
el.btnSync.addEventListener("click", sincronizar);
el.camber.slider.addEventListener("input", () => avaliar("camber"));
el.caster.slider.addEventListener("input", () => avaliar("caster"));
el.conv.slider.addEventListener("input", () => avaliar("conv"));
el.btnPesquisar.addEventListener("click", pesquisar);
el.btnLimpar.addEventListener("click", limparFiltros);

document.querySelectorAll(".filtro-input").forEach(inp => {
    inp.addEventListener("keydown", e => { if (e.key === "Enter") pesquisar(); });
});
