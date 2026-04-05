/**
 * ============================================================
 * ALIGN PRO 3D — services.js
 * Catálogo de Serviços e Tabela de Preços
 *
 * CAMPOS:
 *   id       : string  — Identificador único (não altere IDs existentes)
 *   name     : string  — Nome do serviço exibido no app
 *   cat      : string  — Categoria para agrupamento
 *   price    : number  — Preço base em R$ (edite aqui para atualizar)
 *   time     : string  — Tempo estimado de execução
 *   icon     : string  — Emoji representativo
 *   desc     : string  — Descrição curta para o cliente
 *
 * MANUTENÇÃO:
 *   - Para alterar um preço: edite o campo `price` do serviço
 *   - Para desativar: adicione `active: false`
 *   - Para novo serviço: copie um bloco e gere um id único
 * ============================================================
 */

window.SERVICES = [
  // ── ALINHAMENTO ──────────────────────────────────────────────
  {
    id: "ali3d",
    name: "Alinhamento 3D Completo",
    cat: "alinhamento",
    price: 130,
    time: "45 min",
    icon: "🎯",
    desc: "Ajuste de câmber, cáster e convergência com tecnologia 3D",
    active: true
  },
  {
    id: "ali2d",
    name: "Alinhamento Dianteiro",
    cat: "alinhamento",
    price: 70,
    time: "25 min",
    icon: "🔵",
    desc: "Ajuste de convergência e câmber apenas no eixo dianteiro",
    active: true
  },

  // ── BALANCEAMENTO ────────────────────────────────────────────
  {
    id: "bal4",
    name: "Balanceamento 4 Rodas",
    cat: "balanceamento",
    price: 80,
    time: "30 min",
    icon: "⚖️",
    desc: "Balanceamento computadorizado das 4 rodas",
    active: true
  },
  {
    id: "bal2",
    name: "Balanceamento 2 Rodas",
    cat: "balanceamento",
    price: 45,
    time: "15 min",
    icon: "⚖️",
    desc: "Balanceamento de 2 rodas (eixo dianteiro ou traseiro)",
    active: true
  },

  // ── COMBOS ───────────────────────────────────────────────────
  {
    id: "alibal",
    name: "Alinhamento 3D + Balanceamento 4",
    cat: "combo",
    price: 190,
    time: "1h 15min",
    icon: "🏆",
    desc: "Combo completo — alinhamento 3D + balanceamento das 4 rodas",
    active: true
  },
  {
    id: "geo_full",
    name: "Geometria Completa (4 Rodas)",
    cat: "combo",
    price: 280,
    time: "2h",
    icon: "📐",
    desc: "Geometria completa: 3D + balanceamento + convergência + rodízio",
    active: true
  },

  // ── AJUSTES ESPECÍFICOS ──────────────────────────────────────
  {
    id: "cam_adj",
    name: "Correção de Câmber",
    cat: "ajuste",
    price: 80,
    time: "30 min",
    icon: "🔩",
    desc: "Ajuste da inclinação lateral das rodas (queda)",
    active: true
  },
  {
    id: "cas_adj",
    name: "Correção de Cáster",
    cat: "ajuste",
    price: 80,
    time: "30 min",
    icon: "🔧",
    desc: "Ajuste do ângulo de avanço do eixo de esterçamento",
    active: true
  },
  {
    id: "toe_adj",
    name: "Ajuste de Convergência (Toe)",
    cat: "ajuste",
    price: 60,
    time: "20 min",
    icon: "📏",
    desc: "Correção da convergência/divergência das rodas",
    active: true
  },
  {
    id: "vol_adj",
    name: "Centralização do Volante",
    cat: "ajuste",
    price: 50,
    time: "20 min",
    icon: "🚗",
    desc: "Correção de volante torto sem alterar a geometria",
    active: true
  },

  // ── REVISÃO E INSPEÇÃO ───────────────────────────────────────
  {
    id: "sus_insp",
    name: "Inspeção de Suspensão",
    cat: "revisao",
    price: 60,
    time: "30 min",
    icon: "🔍",
    desc: "Verificação de folgas, amortecedores, buchas e rótulas",
    active: true
  },
  {
    id: "pressao",
    name: "Calibração de Pneus",
    cat: "revisao",
    price: 20,
    time: "10 min",
    icon: "💨",
    desc: "Calibração conforme recomendação do fabricante",
    active: true
  },

  // ── PNEUS ────────────────────────────────────────────────────
  {
    id: "rodizio",
    name: "Rodízio de Pneus",
    cat: "pneu",
    price: 60,
    time: "30 min",
    icon: "🔄",
    desc: "Troca de posição dos pneus para desgaste uniforme",
    active: true
  },
  {
    id: "mont_pneu",
    name: "Montagem de Pneu (por unidade)",
    cat: "pneu",
    price: 25,
    time: "10 min",
    icon: "🛞",
    desc: "Desmontagem e montagem de 1 pneu na roda",
    active: true
  },
];

// Retorna apenas serviços ativos
window.ACTIVE_SERVICES = window.SERVICES.filter(s => s.active !== false);

// Categorias únicas para filtro
window.SERVICE_CATS = [...new Set(window.ACTIVE_SERVICES.map(s => s.cat))];

// Mapa por id para lookup rápido
window.SERVICES_MAP = Object.fromEntries(window.ACTIVE_SERVICES.map(s => [s.id, s]));
