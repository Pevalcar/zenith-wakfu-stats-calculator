/**
 * Zenith Wakfu Stats Calculator - Content Script
 *
 * Calcula automáticamente las estadísticas de Dominio y Resistencia
 * en las tarjetas de equipamiento del Builder de Zenith Wakfu
 *
 * @author Pevalcar
 * @copyright Copyright (c) 2025 Pevalcar
 * @license MIT
 * @version 1.0.0
 * @see https://github.com/Pevalcar/browser-extension
 */

// Traducciones para las tablas
const i18n = {
  es: {
    domainPositive: "Dominio sumado",
    domainNegative: "Dominios negativos",
    domainTotal: "Dominio Total",
    resistancePositive: "Resistencia sumada",
    resistanceNegative: "Resistencias negativas",
    resistanceTotal: "Resistencia Total",
  },
  en: {
    domainPositive: "Mastery summed",
    domainNegative: "Negative masteries",
    domainTotal: "Total Mastery",
    resistancePositive: "Resistance summed",
    resistanceNegative: "Negative resistances",
    resistanceTotal: "Total Resistance",
  },
  fr: {
    domainPositive: "Maîtrise additionnée",
    domainNegative: "Maîtrises négatives",
    domainTotal: "Maîtrise Totale",
    resistancePositive: "Résistance additionnée",
    resistanceNegative: "Résistances négatives",
    resistanceTotal: "Résistance Totale",
  },
};

// Idioma actual (por defecto español)
let currentLanguage = "es";

// Cargar idioma guardado
chrome.storage.sync.get(["language"], (result) => {
  if (result.language) {
    currentLanguage = result.language;
    updateAllTables();
  }
});

// Escuchar cambios de idioma
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.language) {
    currentLanguage = changes.language.newValue;
    updateAllTables();
  }
});

/**
 * Mapeo de tipos de dominio y resistencia
 */
const STAT_TYPES = {
  // Dominios
  DOMAIN_DISTANCE: "Dominio distancia",
  DOMAIN_MELEE: "Dominio cuerpo a cuerpo",
  DOMAIN_ELEMENTAL: "Dominio elemental",
  DOMAIN_BACK: "Dominio espalda",

  // Tipos de daño
  DAMAGE_NEUTRAL: "Daño neutral",
  DAMAGE_FIRE: "Daño fuego",
  DAMAGE_WATER: "Daño agua",
  DAMAGE_AIR: "Daño aire",
  DAMAGE_EARTH: "Daño tierra",

  // Resistencias
  RES_ELEMENTAL: "Resistencia elemental",
  RES_FIRE: "Resistencia fuego",
  RES_WATER: "Resistencia agua",
  RES_AIR: "Resistencia aire",
  RES_EARTH: "Resistencia tierra",
};

/**
 * Elementos que cuentan como "dominio" - Multiidioma
 */
const DOMAIN_KEYWORDS = [
  // Español
  "dominio distancia",
  "dominio cuerpo a cuerpo",
  "dominio espalda",
  "dominio elemental",
  "dominio crítico",
  "dominio cura",
  "dominio berserker",
  "dominio de melé",
  "dominio",
  "daño neutral",
  "daño fuego",
  "daño agua",
  "daño aire",
  "daño tierra",
  "daño",

  // English
  "distance mastery",
  "rear mastery",
  "melee mastery",
  "elemental mastery",
  "back mastery",
  "critical mastery",
  "healing mastery",
  "berserker mastery",
  "mastery",
  "fire damage",
  "water damage",
  "air damage",
  "earth damage",
  "neutral damage",
  "damage",

  // Français
  "maîtrise distance",
  "maîtrise dos",
  "maîtrise mêlée",
  "maîtrise élémentaire",
  "maîtrise critique",
  "maîtrise soin",
  "maîtrise berserk",
  "maîtrise",
  "distance",
  "mêlée",
  "élémentaire",
  "dos",
  "critique",
  "soin",
  "berserk",
  "dégâts",
  "dégâts feu",
  "dégâts eau",
  "dégâts air",
  "dégâts terre",
];

/**
 * Elementos de resistencia - Multiidioma
 */
const RESISTANCE_KEYWORDS = [
  // Español
  "resistencia elemental",
  "resistencia fuego",
  "resistencia agua",
  "resistencia aire",
  "resistencia tierra",

  // English
  "elemental resistance",
  "fire resistance",
  "water resistance",
  "air resistance",
  "earth resistance",

  // Français
  "résistance élémentaire",
  "résistance feu",
  "résistance eau",
  "résistance air",
  "résistance terre",
];

/**
 * Procesa un valor de estadística
 * @param {string} text - Texto de la estadística (ej: "45 Resistencia elemental")
 * @returns {object} {value: number, type: string, fullText: string}
 */
function parseStatistic(text) {
  const trimmed = text.toLowerCase().trim();

  // Extraer el número al inicio (puede ser negativo con -)
  const match = trimmed.match(/^(-?\d+)\s+(.+)$/);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const statType = match[2].trim();

  return {
    value: value,
    type: statType,
    fullText: text,
  };
}

/**
 * Suma los dominios de una tarjeta (separando positivos y negativos)
 * @param {array} stats - Array de estadísticas parseadas
 * @returns {object} {positive: number, negative: number, total: number}
 */
function sumDomains(stats) {
  let positive = 0;
  let negative = 0;

  stats.forEach((stat) => {
    const statType = stat.type.toLowerCase();

    // Detectar "Dominio/Maîtrise/Mastery [en/with/à/sur] X elementos" o variantes
    const elementMatch = statType.match(
      /(?:dominio|ma[îi]trise|mastery|d[eé]g[aâ]ts?|damage)\s+(?:en|in|with|to|à|sur)?\s*(\d+)\s*(?:elementos?|elements?|éléments?)/i
    );

    let contribution = 0;

    if (elementMatch) {
      const numElements = parseInt(elementMatch[1], 10);
      // Multiplica el valor por el número de elementos
      contribution = stat.value * numElements;
    } else if (
      DOMAIN_KEYWORDS.some((keyword) =>
        statType.includes(keyword.toLowerCase())
      )
    ) {
      // Dominio directo (se cuenta como 1 elemento)
      contribution = stat.value;
    }

    // Separar positivos y negativos
    if (contribution > 0) {
      positive += contribution;
    } else if (contribution < 0) {
      negative += Math.abs(contribution);
    }
  });

  return {
    positive: positive,
    negative: negative,
    total: positive - negative,
  };
}

/**
 * Suma las resistencias con reglas especiales - Multiidioma
 * @param {array} stats - Array de estadísticas parseadas
 * @returns {object} {total: number, breakdown: object}
 */
function sumResistances(stats) {
  const breakdown = {
    elemental: 0, // Suma 4 veces (a todos los elementos)
    multiElement: 0, // "Resistencia en X elementos" - suma X veces
    fire: 0, // Suma 1 vez
    water: 0, // Suma 1 vez
    air: 0, // Suma 1 vez
    earth: 0, // Suma 1 vez
  };

  stats.forEach((stat) => {
    const statType = stat.type.toLowerCase();
    const value = stat.value; // Puede ser negativo

    // Detectar "Resistencia/Résistance [en/in/with/à/sur] X elementos"
    const multiElementMatch = statType.match(
      /(?:resistencia|r[eé]sistance|resistance)\s+(?:en|in|with|to|à|sur)?\s*(\d+)\s*(?:elementos?|elements?|éléments?)/i
    );
    if (multiElementMatch) {
      const numElements = parseInt(multiElementMatch[1], 10);
      breakdown.multiElement += value * numElements;
    }
    // Resistencia elemental suma 4 veces
    else if (
      statType.includes("resistencia elemental") ||
      statType.includes("résistance élémentaire") ||
      statType.includes("elemental resistance")
    ) {
      breakdown.elemental = value;
    }
    // Resistencias específicas (con variantes en varios idiomas)
    else if (
      statType.includes("resistencia fuego") ||
      statType.includes("resistencia al fuego") ||
      statType.includes("résistance feu") ||
      statType.includes("résistance au feu") ||
      statType.includes("fire resistance")
    ) {
      breakdown.fire = value;
    } else if (
      statType.includes("resistencia agua") ||
      statType.includes("resistencia al agua") ||
      statType.includes("résistance eau") ||
      statType.includes("résistance à l'eau") ||
      statType.includes("water resistance")
    ) {
      breakdown.water = value;
    } else if (
      statType.includes("resistencia aire") ||
      statType.includes("resistencia al aire") ||
      statType.includes("résistance air") ||
      statType.includes("résistance à l'air") ||
      statType.includes("air resistance")
    ) {
      breakdown.air = value;
    } else if (
      statType.includes("resistencia tierra") ||
      statType.includes("resistencia a la tierra") ||
      statType.includes("résistance terre") ||
      statType.includes("résistance à la terre") ||
      statType.includes("earth resistance")
    ) {
      breakdown.earth = value;
    }
  });

  // Calcular total aplicando reglas
  let positive = 0;
  let negative = 0;

  // Resistencia elemental suma 4 veces (a todos los elementos)
  const elementalTotal = breakdown.elemental * 4;
  if (elementalTotal > 0) positive += elementalTotal;
  else if (elementalTotal < 0) negative += Math.abs(elementalTotal);

  // Resistencias en X elementos ya se multiplican en el cálculo
  if (breakdown.multiElement > 0) positive += breakdown.multiElement;
  else if (breakdown.multiElement < 0)
    negative += Math.abs(breakdown.multiElement);

  // Resistencias específicas suman 1 vez (pueden ser negativas)
  if (breakdown.fire > 0) positive += breakdown.fire;
  else if (breakdown.fire < 0) negative += Math.abs(breakdown.fire);

  if (breakdown.water > 0) positive += breakdown.water;
  else if (breakdown.water < 0) negative += Math.abs(breakdown.water);

  if (breakdown.air > 0) positive += breakdown.air;
  else if (breakdown.air < 0) negative += Math.abs(breakdown.air);

  if (breakdown.earth > 0) positive += breakdown.earth;
  else if (breakdown.earth < 0) negative += Math.abs(breakdown.earth);

  return {
    positive: positive,
    negative: negative,
    total: positive - negative,
    breakdown: breakdown,
  };
}

/**
 * Crea elemento HTML tabla para mostrar suma de dominios
 * @param {object} domainData - {positive: number, negative: number, total: number}
 * @returns {HTMLElement} Elemento tabla
 */
function createDomainSummary(domainData) {
  const container = document.createElement("div");
  container.className = "equipment-domain-summary";
  container.setAttribute("data-translatable", "true");

  // Si no hay dominios ni positivos ni negativos, devolver vacío
  if (domainData.positive === 0 && domainData.negative === 0) {
    return container;
  }

  const table = document.createElement("table");
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    border: 1px solid #4ade80;
    background-color: rgba(74, 222, 128, 0.1);
  `;

  // Fila 1: Dominio sumado (positivos)
  if (domainData.positive > 0) {
    const row1 = table.insertRow();
    row1.style.cssText = "border-bottom: 1px solid #4ade80;";
    const cell1a = row1.insertCell();
    const cell1b = row1.insertCell();
    cell1a.textContent = i18n[currentLanguage].domainPositive;
    cell1a.setAttribute("data-i18n-key", "domainPositive");
    cell1a.style.cssText =
      "padding: 6px; color: #4ade80; font-weight: bold; text-align: left;";
    cell1b.textContent = domainData.positive;
    cell1b.style.cssText =
      "padding: 6px; color: #4ade80; font-weight: bold; text-align: right;";
  }

  // Fila 2: Dominios negativos (solo si hay negativos)
  if (domainData.negative > 0) {
    const row2 = table.insertRow();
    row2.style.cssText = "border-bottom: 1px solid #ff6b6b;";
    const cell2a = row2.insertCell();
    const cell2b = row2.insertCell();
    cell2a.textContent = i18n[currentLanguage].domainNegative;
    cell2a.setAttribute("data-i18n-key", "domainNegative");
    cell2a.style.cssText =
      "padding: 6px; color: #ff6b6b; font-weight: bold; text-align: left;";
    cell2b.textContent = `-${domainData.negative}`;
    cell2b.style.cssText =
      "padding: 6px; color: #ff6b6b; font-weight: bold; text-align: right;";
  }

  // Fila 3: Dominio total (siempre)
  const row3 = table.insertRow();
  const cell3a = row3.insertCell();
  const cell3b = row3.insertCell();
  cell3a.textContent = i18n[currentLanguage].domainTotal;
  cell3a.setAttribute("data-i18n-key", "domainTotal");
  const totalColor = domainData.total < 0 ? "#ff6b6b" : "#4ade80";
  cell3a.style.cssText = `padding: 6px; color: ${totalColor}; font-weight: bold; text-align: left;`;
  cell3b.textContent = domainData.total;
  cell3b.style.cssText = `padding: 6px; color: ${totalColor}; font-weight: bold; text-align: right;`;

  container.appendChild(table);
  return container;
}

/**
 * Crea elemento HTML tabla para mostrar suma de resistencias
 * @param {object} resistanceData - {positive: number, negative: number, total: number}
 * @returns {HTMLElement} Elemento tabla
 */
function createResistanceSummary(resistanceData) {
  const container = document.createElement("div");
  container.className = "equipment-resistance-summary";
  container.setAttribute("data-translatable", "true");

  // Si no hay resistencias ni positivas ni negativas, devolver vacío
  if (resistanceData.positive === 0 && resistanceData.negative === 0) {
    return container;
  }

  const table = document.createElement("table");
  table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    border: 1px solid #60a5fa;
    background-color: rgba(96, 165, 250, 0.1);
  `;

  // Fila 1: Resistencia sumada (positivas)
  if (resistanceData.positive > 0) {
    const row1 = table.insertRow();
    row1.style.cssText = "border-bottom: 1px solid #60a5fa;";
    const cell1a = row1.insertCell();
    const cell1b = row1.insertCell();
    cell1a.textContent = i18n[currentLanguage].resistancePositive;
    cell1a.setAttribute("data-i18n-key", "resistancePositive");
    cell1a.style.cssText =
      "padding: 6px; color: #60a5fa; font-weight: bold; text-align: left;";
    cell1b.textContent = resistanceData.positive;
    cell1b.style.cssText =
      "padding: 6px; color: #60a5fa; font-weight: bold; text-align: right;";
  }

  // Fila 2: Resistencias negativas (solo si hay negativas)
  if (resistanceData.negative > 0) {
    const row2 = table.insertRow();
    row2.style.cssText = "border-bottom: 1px solid #ff6b6b;";
    const cell2a = row2.insertCell();
    const cell2b = row2.insertCell();
    cell2a.textContent = i18n[currentLanguage].resistanceNegative;
    cell2a.setAttribute("data-i18n-key", "resistanceNegative");
    cell2a.style.cssText =
      "padding: 6px; color: #ff6b6b; font-weight: bold; text-align: left;";
    cell2b.textContent = `-${resistanceData.negative}`;
    cell2b.style.cssText =
      "padding: 6px; color: #ff6b6b; font-weight: bold; text-align: right;";
  }

  // Fila 3: Resistencia total (siempre)
  const row3 = table.insertRow();
  const cell3a = row3.insertCell();
  const cell3b = row3.insertCell();
  cell3a.textContent = i18n[currentLanguage].resistanceTotal;
  cell3a.setAttribute("data-i18n-key", "resistanceTotal");
  const totalColor = resistanceData.total < 0 ? "#ff6b6b" : "#60a5fa";
  cell3a.style.cssText = `padding: 6px; color: ${totalColor}; font-weight: bold; text-align: left;`;
  cell3b.textContent = resistanceData.total;
  cell3b.style.cssText = `padding: 6px; color: ${totalColor}; font-weight: bold; text-align: right;`;

  container.appendChild(table);
  return container;
}

/**
 * Procesa una tarjeta de equipamiento
 * @param {HTMLElement} card - Elemento de la tarjeta
 */
function processEquipmentCard(card) {
  // Obtener el contenedor de estadísticas
  // Buscar en diferentes posibles localizaciones según el idioma
  const statsContainer =
    card.querySelector(".tooltip-effect") ||
    card.querySelector(".stats-container") ||
    card.querySelector("[class*='stats']");

  if (!statsContainer) {
    console.debug(
      "[Zenith Wakfu] No se encontró contenedor de estadísticas en tarjeta"
    );
    return;
  }

  // Obtener todas las líneas de estadísticas
  const statLines = statsContainer.querySelectorAll(".stats-line");
  const stats = [];

  statLines.forEach((line) => {
    const text = line.textContent.trim();
    const parsed = parseStatistic(text);
    if (parsed) {
      stats.push(parsed);
    }
  });

  if (stats.length === 0) {
    console.debug(
      "[Zenith Wakfu] No se encontraron estadísticas válidas en tarjeta"
    );
    return;
  }

  // Calcular sumas
  const domainData = sumDomains(stats);
  const resistanceData = sumResistances(stats);

  // Agregar tabla de dominios
  const domainSummary = createDomainSummary(domainData);
  if (domainSummary.children.length > 0) {
    statsContainer.appendChild(domainSummary);
  }

  // Agregar tabla de resistencias
  const resistanceSummary = createResistanceSummary(resistanceData);
  if (resistanceSummary.children.length > 0) {
    statsContainer.appendChild(resistanceSummary);
  }

  // Agregar clase para identificar tarjetas procesadas
  card.classList.add("equipment-processed");
}

/**
 * Procesa todas las tarjetas de equipamiento en la página
 */
function processAllEquipmentCards() {
  const cards = document.querySelectorAll(".equipment");
  let processed = 0;

  cards.forEach((card) => {
    // Evitar procesar la misma tarjeta dos veces (a menos que se haya limpiado)
    if (!card.classList.contains("equipment-processed")) {
      processEquipmentCard(card);
      processed++;
    }
  });

  console.log(
    `[Zenith Wakfu] Procesadas ${processed} tarjetas de equipamiento (Total: ${cards.length})`
  );
}

/**
 * Observador de mutaciones para procesar nuevas tarjetas dinámicamente
 */
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    // Buscar si se agregaron nuevas tarjetas o si cambió el contenido de estadísticas
    let hasNewCards = false;
    let hasTextChanges = false;

    mutations.forEach((mutation) => {
      // Detectar nuevas tarjetas añadidas
      if (mutation.type === "childList") {
        const newCards = mutation.addedNodes;
        newCards.forEach((node) => {
          if (node.nodeType === 1) {
            // Node.ELEMENT_NODE
            if (node.classList && node.classList.contains("equipment")) {
              hasNewCards = true;
            } else if (node.querySelectorAll) {
              const cards = node.querySelectorAll(".equipment");
              if (cards.length > 0) hasNewCards = true;
            }
          }
        });
      }

      // Detectar cambios en el texto de estadísticas (cambios de idioma)
      if (mutation.type === "characterData" || mutation.type === "childList") {
        if (mutation.target && mutation.target.classList) {
          if (
            mutation.target.classList.contains("stats-line") ||
            mutation.target.closest(".stats-line")
          ) {
            hasTextChanges = true;
          }
        }
      }
    });

    if (hasNewCards) {
      // Pequeño delay para asegurar que el DOM está listo
      setTimeout(() => {
        processAllEquipmentCards();
      }, 100);
    }

    if (hasTextChanges) {
      // Si hay cambios de texto (posible cambio de idioma), reprocesar todas las tarjetas
      setTimeout(() => {
        console.log(
          "[Zenith Wakfu] Cambio de contenido detectado, reprocesando..."
        );
        document.querySelectorAll(".equipment-processed").forEach((card) => {
          card.classList.remove("equipment-processed");
          // Limpiar sumarios antiguos
          card
            .querySelectorAll(
              ".equipment-domain-summary, .equipment-resistance-summary"
            )
            .forEach((el) => {
              el.remove();
            });
        });
        processAllEquipmentCards();
      }, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    characterDataOldValue: false,
  });

  console.log("[Zenith Wakfu] Observador de mutaciones configurado (mejorado)");
}

/**
 * Actualiza todas las tablas existentes con el idioma actual
 */
function updateAllTables() {
  // Actualizar todas las tablas de dominios
  document
    .querySelectorAll('.equipment-domain-summary[data-translatable="true"]')
    .forEach((container) => {
      const cells = container.querySelectorAll("[data-i18n-key]");
      cells.forEach((cell) => {
        const key = cell.getAttribute("data-i18n-key");
        if (i18n[currentLanguage][key]) {
          cell.textContent = i18n[currentLanguage][key];
        }
      });
    });

  // Actualizar todas las tablas de resistencias
  document
    .querySelectorAll('.equipment-resistance-summary[data-translatable="true"]')
    .forEach((container) => {
      const cells = container.querySelectorAll("[data-i18n-key]");
      cells.forEach((cell) => {
        const key = cell.getAttribute("data-i18n-key");
        if (i18n[currentLanguage][key]) {
          cell.textContent = i18n[currentLanguage][key];
        }
      });
    });
}

/**
 * CSS adicional para los sumarios
 */
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .equipment-total-domain,
    .equipment-total-resistance {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 8px;
      margin-top: 8px;
      font-size: 1.1em;
      background: rgba(0, 0, 0, 0.3);
      padding: 8px;
      border-radius: 4px;
    }
    
    .equipment-total-domain strong:last-child {
      color: #4ade80 !important;
    }
    
    .equipment-total-resistance strong:last-child {
      color: #60a5fa !important;
    }
  `;

  document.head.appendChild(style);
  console.log("[Zenith Wakfu] Estilos inyectados");
}

/**
 * Inicialización
 */
function init() {
  console.log("[Zenith Wakfu] Iniciando script de contenido...");

  // Inyectar estilos
  injectStyles();

  // Procesar tarjetas existentes después de un pequeño delay
  setTimeout(() => {
    processAllEquipmentCards();
  }, 500);

  // Procesar nuevamente después de un tiempo adicional (para cambios dinámicos)
  setTimeout(() => {
    processAllEquipmentCards();
  }, 2000);

  // Configurar observador para nuevas tarjetas
  setupMutationObserver();

  // Intervalo adicional para detectar cambios de idioma o actualizaciones
  // (cada 5 segundos verifica si hay tarjetas no procesadas)
  setInterval(() => {
    const unprocessedCards = Array.from(
      document.querySelectorAll(".equipment")
    ).filter((card) => !card.classList.contains("equipment-processed"));
    if (unprocessedCards.length > 0) {
      console.log(
        `[Zenith Wakfu] Se encontraron ${unprocessedCards.length} tarjetas sin procesar`
      );
      processAllEquipmentCards();
    }
  }, 5000);

  console.log("[Zenith Wakfu] Script de contenido inicializado");
}

// Ejecutar cuando el DOM esté completamente cargado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  init();
}
