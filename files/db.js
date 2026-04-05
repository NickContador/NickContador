/**
 * ============================================================
 * ALIGN PRO 3D — db.js
 * Banco de Dados de Alinhamento 3D
 * Fonte: wlmedeiros.blogspot.com
 *
 * ESTRUTURA DE CADA REGISTRO:
 *   brand    : string  — Fabricante
 *   model    : string  — Modelo completo
 *   year     : string  — Ano de referência
 *   aro      : number  — Tamanho da roda (polegadas)
 *   front    : object  — Especificações dianteiras
 *     .convMm   : string — Convergência total em milímetros
 *     .convGrau : string — Convergência em graus
 *     .camber   : string — Câmber (queda)
 *     .caster   : string — Cáster (avanço)
 *   rear     : object  — Especificações traseiras
 *     .convMm   : string — Convergência total em milímetros
 *     .convGrau : string — Convergência em graus
 *     .camber   : string — Câmber traseiro
 *   url      : string  — Link do post original
 *
 * COMO LER A CONVERGÊNCIA:
 *   Formato: valor_ideal (±) tolerância
 *   Ex: +1,42 (±) 1,77  →  mín: -0,35 mm  |  ideal: +1,42 mm  |  máx: +3,19 mm
 *
 * MANUTENÇÃO:
 *   Para adicionar um veículo, copie um bloco abaixo e edite os valores.
 *   A fonte oficial é: https://wlmedeiros.blogspot.com
 * ============================================================
 */

window.ALIGNMENT_DB = [

  // ══════════════════════════════════════════════
  // HYUNDAI
  // ══════════════════════════════════════════════
  {
    brand: "Hyundai", model: "Creta", year: "2023", aro: 16,
    front: { convMm: "+0,71 (±) 1,42", convGrau: "+0°06 (±) 0°12", camber: "-0°30 (±) 0°30", caster: "+4°17 (±) 0°30" },
    rear:  { convMm: "+2,35 (±) 2,12", convGrau: "+0°19 (±) 0°18", camber: "-1°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2026/03/hyundai-creta.html"
  },
  {
    brand: "Hyundai", model: "HB20 Hatch", year: "2022", aro: 15,
    front: { convMm: "+0,72 (±) 1,44", convGrau: "+0°06 (±) 0°12", camber: "-0°20 (±) 0°30", caster: "+3°20 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°10 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Hyundai", model: "Tucson", year: "2022", aro: 17,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°30 (±) 0°30", caster: "+4°00 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Hyundai", model: "Santa Fe", year: "2022", aro: 18,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°35 (±) 0°30", caster: "+4°10 (±) 0°30" },
    rear:  { convMm: "+2,67 (±) 2,00", convGrau: "+0°22 (±) 0°17", camber: "-1°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Hyundai", model: "i30 N Line", year: "2022", aro: 17,
    front: { convMm: "-0,56 (±) 0,56", convGrau: "-0°05 (±) 0°05", camber: "-0°45 (±) 0°30", caster: "+5°30 (±) 0°30" },
    rear:  { convMm: "+2,67 (±) 1,13", convGrau: "+0°22 (±) 0°09", camber: "-1°40 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // LAND ROVER
  // ══════════════════════════════════════════════
  {
    brand: "Land Rover", model: "Range Rover Evoque", year: "2023", aro: 17,
    front: { convMm: "+1,63 (±) 1,13", convGrau: "+0°13 (±) 0°09", camber: "-0°47 (±) 0°45", caster: "+3°12 (±) 0°45" },
    rear:  { convMm: "+1,51 (±) 1,13", convGrau: "+0°12 (±) 0°09", camber: "-1°29 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2026/03/land-rover-range-rover-evoque.html"
  },
  {
    brand: "Land Rover", model: "Discovery Sport", year: "2022", aro: 18,
    front: { convMm: "+0,74 (±) 0,74", convGrau: "+0°06 (±) 0°06", camber: "-0°30 (±) 0°45", caster: "+4°00 (±) 0°45" },
    rear:  { convMm: "+2,26 (±) 2,26", convGrau: "+0°19 (±) 0°19", camber: "-1°15 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // RAM
  // ══════════════════════════════════════════════
  {
    brand: "Ram", model: "Rampage Bighorn 2.0 Diesel", year: "2024", aro: 17,
    front: { convMm: "+0,50 (±) 0,50", convGrau: "+0°04 (±) 0°04", camber: "-0°40 (±) 0°35", caster: "+3°59 (±) 0°30" },
    rear:  { convMm: "+1,63 (±) 0,73", convGrau: "+0°13 (±) 0°06", camber: "-0°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2026/03/ram-rampage-bighorn.html"
  },

  // ══════════════════════════════════════════════
  // BMW
  // ══════════════════════════════════════════════
  {
    brand: "BMW", model: "X7 AWD (G07)", year: "2023", aro: 20,
    front: { convMm: "+0,89 (±) 0,59", convGrau: "+0°06 (±) 0°04", camber: "-0°22 (±) 0°25", caster: "---" },
    rear:  { convMm: "+1,48 (±) 0,59", convGrau: "+0°10 (±) 0°04", camber: "-1°30 (±) 0°05" },
    url: "https://wlmedeiros.blogspot.com/2026/03/bmw-x7.html"
  },
  {
    brand: "BMW", model: "X1 AWD (U11) Susp. Normal", year: "2023", aro: 17,
    front: { convMm: "+0,75 (±) 0,51", convGrau: "+0°06 (±) 0°04", camber: "-0°40 (±) 0°25", caster: "---" },
    rear:  { convMm: "+2,26 (±) 0,50", convGrau: "+0°18 (±) 0°04", camber: "-1°45 (±) 0°05" },
    url: "https://wlmedeiros.blogspot.com/2024/09/bmw-x1-awd-u11.html"
  },
  {
    brand: "BMW", model: "X3 xDrive (G01)", year: "2022", aro: 18,
    front: { convMm: "+0,38 (±) 0,56", convGrau: "+0°03 (±) 0°05", camber: "-0°20 (±) 0°25", caster: "---" },
    rear:  { convMm: "+2,78 (±) 0,56", convGrau: "+0°23 (±) 0°05", camber: "-1°30 (±) 0°05" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "BMW", model: "320i Sedan (G20)", year: "2021", aro: 17,
    front: { convMm: "+0,15 (±) 0,55", convGrau: "+0°01 (±) 0°05", camber: "-0°13 (±) 0°30", caster: "---" },
    rear:  { convMm: "+3,00 (±) 0,80", convGrau: "+0°25 (±) 0°07", camber: "-2°00 (±) 0°20" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // FIAT
  // ══════════════════════════════════════════════
  {
    brand: "Fiat", model: "Ducato Cargo", year: "2024", aro: 16,
    front: { convMm: "-1,00 (±) 1,00", convGrau: "-0°08 (±) 0°08", camber: "+0°00 (±) 0°30", caster: "+1°45 (±) 0°30" },
    rear:  { convMm: "-2,72 (±) 1,75", convGrau: "-0°23 (±) 0°14", camber: "-0°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2026/01/fiat-ducato.html"
  },
  {
    brand: "Fiat", model: "Cronos Precision", year: "2023", aro: 16,
    front: { convMm: "-1,18 (±) 1,18", convGrau: "-0°10 (±) 0°10", camber: "-0°38 (±) 0°30", caster: "+3°25 (±) 0°30" },
    rear:  { convMm: "+4,02 (±) 3,55", convGrau: "+0°34 (±) 0°30", camber: "-0°42 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2025/05/fiat-cronos-precision.html"
  },
  {
    brand: "Fiat", model: "Argo Drive", year: "2022", aro: 15,
    front: { convMm: "-0,62 (±) 1,24", convGrau: "-0°05 (±) 0°10", camber: "-0°20 (±) 0°30", caster: "+3°30 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°10 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Fiat", model: "Strada", year: "2022", aro: 15,
    front: { convMm: "+0,00 (±) 1,20", convGrau: "+0°00 (±) 0°10", camber: "-0°15 (±) 0°30", caster: "+3°00 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 3,00", convGrau: "+0°00 (±) 0°25", camber: "N/A" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Fiat", model: "Pulse Impetus T200", year: "2022", aro: 17,
    front: { convMm: "+0,40 (±) 1,20", convGrau: "+0°03 (±) 0°10", camber: "-0°25 (±) 0°30", caster: "+3°45 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°25 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Fiat", model: "Toro Ultra", year: "2022", aro: 18,
    front: { convMm: "+0,40 (±) 1,20", convGrau: "+0°03 (±) 0°10", camber: "-0°20 (±) 0°30", caster: "+3°30 (±) 0°30" },
    rear:  { convMm: "+1,00 (±) 2,00", convGrau: "+0°08 (±) 0°17", camber: "-1°10 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Fiat", model: "Uno", year: "2020", aro: 14,
    front: { convMm: "+0,00 (±) 2,00", convGrau: "+0°00 (±) 0°17", camber: "+0°00 (±) 0°30", caster: "+1°30 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°00 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // GM CHEVROLET
  // ══════════════════════════════════════════════
  {
    brand: "GM Chevrolet", model: "Silverado High Country", year: "2024", aro: 20,
    front: { convMm: "+3,66 (±) 1,66", convGrau: "+0°25 (±) 0°11", camber: "-0°30 (±) 0°30", caster: "+3°20 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 0,55", convGrau: "+0°00 (±) 0°04", camber: "+0°00 (±) 0°10" },
    url: "https://wlmedeiros.blogspot.com/2026/01/gm-chevrolet-silverado-high-country.html"
  },
  {
    brand: "GM Chevrolet", model: "Trax FWD", year: "2024", aro: 17,
    front: { convMm: "+1,13 (±) 1,51", convGrau: "+0°09 (±) 0°12", camber: "-0°28 (±) 1°00", caster: "+6°31 (±) 1°00" },
    rear:  { convMm: "+1,51 (±) 2,64", convGrau: "+0°12 (±) 0°21", camber: "-1°15 (±) 0°45" },
    url: "https://wlmedeiros.blogspot.com/2025/11/gm-chevrolet-trax.html"
  },
  {
    brand: "GM Chevrolet", model: "Onix Plus Sedan", year: "2022", aro: 15,
    front: { convMm: "+0,56 (±) 1,69", convGrau: "+0°05 (±) 0°14", camber: "-0°20 (±) 0°45", caster: "+3°30 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°00 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "GM Chevrolet", model: "Tracker Turbo", year: "2022", aro: 16,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°30 (±) 0°45", caster: "+4°00 (±) 0°45" },
    rear:  { convMm: "+1,51 (±) 2,64", convGrau: "+0°12 (±) 0°22", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "GM Chevrolet", model: "S10 High Country", year: "2022", aro: 17,
    front: { convMm: "+3,66 (±) 1,66", convGrau: "+0°25 (±) 0°11", camber: "+0°00 (±) 0°30", caster: "+2°30 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 3,00", convGrau: "+0°00 (±) 0°25", camber: "N/A" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "GM Chevrolet", model: "Montana Trail", year: "2024", aro: 17,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°20 (±) 0°30", caster: "+3°45 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 3,00", convGrau: "+0°00 (±) 0°25", camber: "N/A" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "GM Chevrolet", model: "Cruze Sport6", year: "2020", aro: 17,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°30 (±) 0°45", caster: "+5°00 (±) 0°30" },
    rear:  { convMm: "+2,26 (±) 2,26", convGrau: "+0°19 (±) 0°19", camber: "-1°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // CITROËN
  // ══════════════════════════════════════════════
  {
    brand: "Citroën", model: "C3 Aircross", year: "2023", aro: 16,
    front: { convMm: "+2,00 (±) 1,16", convGrau: "+0°17 (±) 0°09", camber: "-0°24 (±) 0°30", caster: "+4°02 (±) 0°30" },
    rear:  { convMm: "+5,07 (±) 1,13", convGrau: "+0°43 (±) 0°09", camber: "-2°00 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2025/11/citroen-c3.html"
  },
  {
    brand: "Citroën", model: "C4 Cactus", year: "2019", aro: 16,
    front: { convMm: "+1,40 (±) 1,13", convGrau: "+0°12 (±) 0°09", camber: "-0°21 (±) 0°30", caster: "+3°47 (±) 0°30" },
    rear:  { convMm: "+3,00 (±) 1,13", convGrau: "+0°25 (±) 0°09", camber: "-1°15 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // BYD
  // ══════════════════════════════════════════════
  {
    brand: "BYD", model: "Song Plus Champion", year: "2024", aro: 19,
    front: { convMm: "+0,00 (±) 1,40", convGrau: "+0°00 (±) 0°10", camber: "-0°50 (±) 0°45", caster: "+2°43 (±) 0°45" },
    rear:  { convMm: "+4,21 (±) 1,41", convGrau: "+0°30 (±) 0°10", camber: "-0°35 (±) 0°45" },
    url: "https://wlmedeiros.blogspot.com/2025/07/byd-song-plus.html"
  },
  {
    brand: "BYD", model: "Dolphin Plus", year: "2024", aro: 17,
    front: { convMm: "+0,00 (±) 1,40", convGrau: "+0°00 (±) 0°12", camber: "-0°40 (±) 0°30", caster: "+3°00 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 1,40", convGrau: "+0°17 (±) 0°12", camber: "-1°15 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "BYD", model: "Seal AWD", year: "2024", aro: 19,
    front: { convMm: "-0,56 (±) 1,13", convGrau: "-0°05 (±) 0°09", camber: "-0°40 (±) 0°30", caster: "+4°00 (±) 0°30" },
    rear:  { convMm: "+2,67 (±) 1,13", convGrau: "+0°22 (±) 0°09", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // FORD
  // ══════════════════════════════════════════════
  {
    brand: "Ford", model: "Transit Furgão", year: "2022", aro: 16,
    front: { convMm: "+2,13 (±) 1,77", convGrau: "+0°18 (±) 0°15", camber: "+0°00 (±) 0°45", caster: "+2°04 (±) 0°45" },
    rear:  { convMm: "+1,42 (±) 1,77", convGrau: "+0°12 (±) 0°15", camber: "+0°13 (±) 0°45" },
    url: "https://wlmedeiros.blogspot.com/2025/07/ford-transit.html"
  },
  {
    brand: "Ford", model: "Ranger XLT", year: "2023", aro: 17,
    front: { convMm: "+2,44 (±) 2,44", convGrau: "+0°17 (±) 0°17", camber: "+0°00 (±) 0°30", caster: "+2°00 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 3,00", convGrau: "+0°00 (±) 0°25", camber: "N/A" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Ford", model: "Bronco Sport", year: "2022", aro: 17,
    front: { convMm: "+0,74 (±) 1,47", convGrau: "+0°06 (±) 0°12", camber: "-0°25 (±) 0°45", caster: "+4°30 (±) 0°45" },
    rear:  { convMm: "+2,26 (±) 2,26", convGrau: "+0°19 (±) 0°19", camber: "-1°10 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Ford", model: "Territory Titanium", year: "2022", aro: 18,
    front: { convMm: "+0,74 (±) 1,47", convGrau: "+0°06 (±) 0°12", camber: "-0°30 (±) 0°45", caster: "+3°50 (±) 0°45" },
    rear:  { convMm: "+2,26 (±) 2,26", convGrau: "+0°19 (±) 0°19", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // RENAULT
  // ══════════════════════════════════════════════
  {
    brand: "Renault", model: "Captur Automático (DP2)", year: "2023", aro: 15,
    front: { convMm: "-1,11 (±) 1,11", convGrau: "-0°09 (±) 0°09", camber: "-1°13 (±) 0°45", caster: "+6°42 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 1,32", convGrau: "+0°16 (±) 0°10", camber: "-1°10 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2025/07/renault-captur_17.html"
  },
  {
    brand: "Renault", model: "Master Furgão", year: "2022", aro: 16,
    front: { convMm: "-1,27 (±) 1,26", convGrau: "-0°11 (±) 0°11", camber: "-0°14 (±) 0°35", caster: "+4°14 (±) 0°35" },
    rear:  { convMm: "+3,52 (±) 2,25", convGrau: "+0°30 (±) 0°19", camber: "-0°27 (±) 0°20" },
    url: "https://wlmedeiros.blogspot.com/2025/05/renault-master.html"
  },
  {
    brand: "Renault", model: "Megane IV (BFB)", year: "2024", aro: 18,
    front: { convMm: "-1,86 (±) 1,33", convGrau: "-0°14 (±) 0°10", camber: "-1°10 (±) 0°30", caster: "+7°30 (±) 1°00" },
    rear:  { convMm: "+2,66 (±) 1,86", convGrau: "+0°20 (±) 0°14", camber: "-0°40 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2025/05/renault-megane-iv.html"
  },
  {
    brand: "Renault", model: "Kwid Intense", year: "2022", aro: 14,
    front: { convMm: "+0,00 (±) 1,20", convGrau: "+0°00 (±) 0°10", camber: "+0°00 (±) 0°30", caster: "+2°40 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°00 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Renault", model: "Sandero Stepway", year: "2022", aro: 15,
    front: { convMm: "+0,40 (±) 1,20", convGrau: "+0°03 (±) 0°10", camber: "-0°20 (±) 0°30", caster: "+2°40 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°10 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Renault", model: "Duster Iconic", year: "2022", aro: 16,
    front: { convMm: "+0,40 (±) 1,20", convGrau: "+0°03 (±) 0°10", camber: "-0°25 (±) 0°30", caster: "+3°30 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°15 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Renault", model: "Logan", year: "2020", aro: 15,
    front: { convMm: "+0,40 (±) 1,60", convGrau: "+0°03 (±) 0°12", camber: "-0°20 (±) 0°30", caster: "+2°00 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-0°45 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // NISSAN
  // ══════════════════════════════════════════════
  {
    brand: "Nissan", model: "Sentra", year: "2020", aro: 18,
    front: { convMm: "+1,30 (±) 1,80", convGrau: "+0°10 (±) 0°13", camber: "-0°05 (±) 0°45", caster: "+5°55 (±) 0°45" },
    rear:  { convMm: "+2,90 (±) 3,40", convGrau: "+0°15 (±) 0°26", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/2024/09/nissan-sentra.html"
  },
  {
    brand: "Nissan", model: "Kicks Advance", year: "2022", aro: 17,
    front: { convMm: "+0,56 (±) 1,69", convGrau: "+0°05 (±) 0°14", camber: "-0°20 (±) 0°45", caster: "+3°30 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Nissan", model: "Frontier LE 4x4", year: "2022", aro: 17,
    front: { convMm: "+2,44 (±) 2,44", convGrau: "+0°17 (±) 0°17", camber: "+0°00 (±) 0°30", caster: "+2°30 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 3,00", convGrau: "+0°00 (±) 0°25", camber: "N/A" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Nissan", model: "Versa Exclusive", year: "2022", aro: 15,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°20 (±) 0°30", caster: "+3°20 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°10 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // VOLKSWAGEN
  // ══════════════════════════════════════════════
  {
    brand: "Volkswagen", model: "Polo Highline", year: "2022", aro: 15,
    front: { convMm: "+0,80 (±) 0,80", convGrau: "+0°07 (±) 0°07", camber: "-0°10 (±) 0°45", caster: "+5°19 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 1,00", convGrau: "+0°17 (±) 0°08", camber: "-1°25 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Volkswagen", model: "Virtus Highline", year: "2022", aro: 16,
    front: { convMm: "+0,80 (±) 0,80", convGrau: "+0°07 (±) 0°07", camber: "-0°10 (±) 0°45", caster: "+5°19 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 1,00", convGrau: "+0°17 (±) 0°08", camber: "-1°25 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Volkswagen", model: "T-Cross Highline", year: "2022", aro: 17,
    front: { convMm: "+0,80 (±) 1,00", convGrau: "+0°07 (±) 0°08", camber: "-0°10 (±) 0°45", caster: "+5°19 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 1,00", convGrau: "+0°17 (±) 0°08", camber: "-1°25 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Volkswagen", model: "Amarok V6 Extreme", year: "2022", aro: 19,
    front: { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "+0°00 (±) 0°30", caster: "+3°00 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 2,00", convGrau: "+0°00 (±) 0°17", camber: "N/A" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Volkswagen", model: "Taos Comfortline", year: "2022", aro: 17,
    front: { convMm: "+0,80 (±) 0,80", convGrau: "+0°07 (±) 0°07", camber: "-0°10 (±) 0°45", caster: "+5°19 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 1,00", convGrau: "+0°17 (±) 0°08", camber: "-1°25 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Volkswagen", model: "Nivus Highline", year: "2022", aro: 17,
    front: { convMm: "+0,80 (±) 0,80", convGrau: "+0°07 (±) 0°07", camber: "-0°10 (±) 0°45", caster: "+5°19 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 1,00", convGrau: "+0°17 (±) 0°08", camber: "-1°25 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // TOYOTA
  // ══════════════════════════════════════════════
  {
    brand: "Toyota", model: "Corolla Altis", year: "2023", aro: 17,
    front: { convMm: "+0,88 (±) 0,88", convGrau: "+0°07 (±) 0°07", camber: "-0°45 (±) 0°30", caster: "+4°30 (±) 0°45" },
    rear:  { convMm: "+2,66 (±) 2,66", convGrau: "+0°22 (±) 0°22", camber: "-1°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Toyota", model: "Hilux SW4 Diamond", year: "2022", aro: 18,
    front: { convMm: "+2,44 (±) 2,44", convGrau: "+0°17 (±) 0°17", camber: "+0°00 (±) 0°30", caster: "+3°30 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 3,00", convGrau: "+0°00 (±) 0°25", camber: "N/A" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Toyota", model: "Yaris XLS", year: "2022", aro: 16,
    front: { convMm: "+0,80 (±) 0,80", convGrau: "+0°07 (±) 0°07", camber: "-0°30 (±) 0°30", caster: "+3°40 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Toyota", model: "RAV4 AWD", year: "2022", aro: 18,
    front: { convMm: "+0,74 (±) 0,74", convGrau: "+0°06 (±) 0°06", camber: "-0°30 (±) 0°30", caster: "+3°30 (±) 0°45" },
    rear:  { convMm: "+2,67 (±) 2,67", convGrau: "+0°22 (±) 0°22", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // HONDA
  // ══════════════════════════════════════════════
  {
    brand: "Honda", model: "Civic EX", year: "2022", aro: 17,
    front: { convMm: "+0,00 (±) 1,60", convGrau: "+0°00 (±) 0°12", camber: "-0°30 (±) 0°45", caster: "+3°40 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°15 (±) 0°15", camber: "-1°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Honda", model: "HR-V EXL", year: "2022", aro: 17,
    front: { convMm: "+0,00 (±) 1,60", convGrau: "+0°00 (±) 0°12", camber: "-0°30 (±) 0°45", caster: "+3°00 (±) 0°45" },
    rear:  { convMm: "+1,00 (±) 2,00", convGrau: "+0°08 (±) 0°15", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Honda", model: "WR-V EXL", year: "2022", aro: 15,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°25 (±) 0°30", caster: "+3°20 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Honda", model: "CR-V Touring", year: "2022", aro: 18,
    front: { convMm: "+0,40 (±) 1,60", convGrau: "+0°03 (±) 0°12", camber: "-0°35 (±) 0°45", caster: "+3°50 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°15 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // JEEP
  // ══════════════════════════════════════════════
  {
    brand: "Jeep", model: "Compass Longitude", year: "2022", aro: 17,
    front: { convMm: "+0,49 (±) 1,47", convGrau: "+0°04 (±) 0°12", camber: "-0°35 (±) 0°35", caster: "+4°08 (±) 0°30" },
    rear:  { convMm: "+2,40 (±) 2,40", convGrau: "+0°20 (±) 0°20", camber: "-1°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Jeep", model: "Renegade Sport", year: "2022", aro: 16,
    front: { convMm: "+0,56 (±) 1,69", convGrau: "+0°05 (±) 0°14", camber: "-0°30 (±) 0°35", caster: "+4°12 (±) 0°30" },
    rear:  { convMm: "+2,26 (±) 2,26", convGrau: "+0°19 (±) 0°19", camber: "-1°40 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Jeep", model: "Commander Limited", year: "2022", aro: 19,
    front: { convMm: "+0,49 (±) 1,47", convGrau: "+0°04 (±) 0°12", camber: "-0°40 (±) 0°35", caster: "+4°20 (±) 0°30" },
    rear:  { convMm: "+2,40 (±) 2,40", convGrau: "+0°20 (±) 0°20", camber: "-1°40 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // PEUGEOT
  // ══════════════════════════════════════════════
  {
    brand: "Peugeot", model: "208 Allure", year: "2022", aro: 16,
    front: { convMm: "+1,94 (±) 1,13", convGrau: "+0°17 (±) 0°09", camber: "-0°30 (±) 0°30", caster: "+3°00 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°10 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Peugeot", model: "2008 Griffe", year: "2022", aro: 17,
    front: { convMm: "+1,94 (±) 1,13", convGrau: "+0°17 (±) 0°09", camber: "-0°25 (±) 0°30", caster: "+3°30 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // MITSUBISHI
  // ══════════════════════════════════════════════
  {
    brand: "Mitsubishi", model: "L200 Triton Sport", year: "2022", aro: 17,
    front: { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "+0°00 (±) 0°30", caster: "+2°00 (±) 0°45" },
    rear:  { convMm: "+0,00 (±) 3,00", convGrau: "+0°00 (±) 0°25", camber: "N/A" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Mitsubishi", model: "Eclipse Cross HPE-S", year: "2022", aro: 18,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°30 (±) 0°45", caster: "+4°00 (±) 0°45" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Mitsubishi", model: "Outlander PHEV", year: "2023", aro: 20,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°25 (±) 0°30", caster: "+3°50 (±) 0°30" },
    rear:  { convMm: "+2,26 (±) 2,26", convGrau: "+0°19 (±) 0°19", camber: "-1°25 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // KIA
  // ══════════════════════════════════════════════
  {
    brand: "Kia", model: "Sportage EX", year: "2022", aro: 18,
    front: { convMm: "+0,56 (±) 1,13", convGrau: "+0°05 (±) 0°09", camber: "-0°30 (±) 0°30", caster: "+4°00 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°30 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Kia", model: "Stinger GT", year: "2021", aro: 19,
    front: { convMm: "-0,56 (±) 1,13", convGrau: "-0°05 (±) 0°09", camber: "-1°00 (±) 0°30", caster: "+7°40 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°45 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Kia", model: "Carnival EX", year: "2022", aro: 18,
    front: { convMm: "+0,40 (±) 1,60", convGrau: "+0°03 (±) 0°12", camber: "-0°20 (±) 0°30", caster: "+3°50 (±) 0°30" },
    rear:  { convMm: "+2,00 (±) 2,00", convGrau: "+0°17 (±) 0°17", camber: "-1°20 (±) 0°30" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // MERCEDES-BENZ
  // ══════════════════════════════════════════════
  {
    brand: "Mercedes-Benz", model: "GLA 200 AMG Line", year: "2022", aro: 18,
    front: { convMm: "+0,10 (±) 0,40", convGrau: "+0°01 (±) 0°03", camber: "-0°23 (±) 0°35", caster: "+6°30 (±) 0°30" },
    rear:  { convMm: "+2,67 (±) 0,57", convGrau: "+0°22 (±) 0°05", camber: "-1°49 (±) 0°25" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Mercedes-Benz", model: "C 200 AMG Line", year: "2022", aro: 18,
    front: { convMm: "+0,15 (±) 0,60", convGrau: "+0°01 (±) 0°05", camber: "-0°13 (±) 0°30", caster: "+7°00 (±) 0°30" },
    rear:  { convMm: "+3,00 (±) 0,80", convGrau: "+0°25 (±) 0°07", camber: "-2°00 (±) 0°20" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Mercedes-Benz", model: "GLE 450 4Matic", year: "2022", aro: 20,
    front: { convMm: "+0,10 (±) 0,40", convGrau: "+0°01 (±) 0°03", camber: "-0°25 (±) 0°30", caster: "+5°30 (±) 0°30" },
    rear:  { convMm: "+3,00 (±) 0,80", convGrau: "+0°25 (±) 0°07", camber: "-1°45 (±) 0°15" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // AUDI
  // ══════════════════════════════════════════════
  {
    brand: "Audi", model: "Q3 Prestige Plus S line", year: "2022", aro: 18,
    front: { convMm: "+0,15 (±) 0,55", convGrau: "+0°01 (±) 0°05", camber: "-0°25 (±) 0°25", caster: "---" },
    rear:  { convMm: "+2,78 (±) 0,55", convGrau: "+0°23 (±) 0°05", camber: "-1°30 (±) 0°20" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Audi", model: "A3 Sedan Prestige Plus", year: "2022", aro: 17,
    front: { convMm: "+0,10 (±) 0,40", convGrau: "+0°01 (±) 0°03", camber: "-0°20 (±) 0°30", caster: "---" },
    rear:  { convMm: "+2,67 (±) 0,57", convGrau: "+0°22 (±) 0°05", camber: "-1°35 (±) 0°25" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Audi", model: "Q5 Performance", year: "2022", aro: 20,
    front: { convMm: "+0,15 (±) 0,56", convGrau: "+0°01 (±) 0°05", camber: "-0°15 (±) 0°20", caster: "---" },
    rear:  { convMm: "+3,00 (±) 0,56", convGrau: "+0°25 (±) 0°05", camber: "-1°20 (±) 0°15" },
    url: "https://wlmedeiros.blogspot.com/"
  },

  // ══════════════════════════════════════════════
  // VOLVO
  // ══════════════════════════════════════════════
  {
    brand: "Volvo", model: "XC60 B5 Momentum", year: "2022", aro: 19,
    front: { convMm: "+0,30 (±) 0,60", convGrau: "+0°02 (±) 0°05", camber: "-0°20 (±) 0°25", caster: "---" },
    rear:  { convMm: "+3,00 (±) 0,60", convGrau: "+0°25 (±) 0°05", camber: "-1°30 (±) 0°20" },
    url: "https://wlmedeiros.blogspot.com/"
  },
  {
    brand: "Volvo", model: "XC40 Recharge", year: "2022", aro: 20,
    front: { convMm: "+0,30 (±) 0,60", convGrau: "+0°02 (±) 0°05", camber: "-0°20 (±) 0°25", caster: "---" },
    rear:  { convMm: "+2,80 (±) 0,60", convGrau: "+0°23 (±) 0°05", camber: "-1°25 (±) 0°20" },
    url: "https://wlmedeiros.blogspot.com/"
  },

];

// Helper: lista única de marcas ordenadas
window.BRANDS = [...new Set(window.ALIGNMENT_DB.map(v => v.brand))].sort();
