/**
 * Zenith Wakfu Stats Calculator - Popup Script
 *
 * @author Pevalcar
 * @copyright Copyright (c) 2025 Pevalcar
 * @license MIT
 */

// Traducciones
const translations = {
  es: {
    whatDoesTitle: "📊 ¿Qué hace esta extensión?",
    whatDoesText:
      "Calcula automáticamente las estadísticas de <strong>Dominio</strong> y <strong>Resistencia</strong> en las tarjetas de equipamiento de Zenith Wakfu Builder.",
    feature1: "Suma automática de dominios positivos",
    feature2: "Detección de dominios negativos",
    feature3: "Cálculo de total neto",
    feature4: "Misma funcionalidad para resistencias",
    howToUseTitle: "📝 Cómo usar",
    step1:
      'Visita <a href="https://www.zenithwakfu.com/builder" target="_blank">zenithwakfu.com/builder</a>',
    step2: "Navega por los equipamientos",
    step3: "Las tablas de estadísticas aparecerán automáticamente",
    supportBtn: "Soporte / Contacto",
    kofiBtn: "Apóyame en Ko-fi",
  },
  en: {
    whatDoesTitle: "📊 What does this extension do?",
    whatDoesText:
      "Automatically calculates <strong>Mastery</strong> and <strong>Resistance</strong> stats on equipment cards in Zenith Wakfu Builder.",
    feature1: "Automatic sum of positive masteries",
    feature2: "Detection of negative masteries",
    feature3: "Net total calculation",
    feature4: "Same functionality for resistances",
    howToUseTitle: "📝 How to use",
    step1:
      'Visit <a href="https://www.zenithwakfu.com/builder" target="_blank">zenithwakfu.com/builder</a>',
    step2: "Browse through equipment",
    step3: "Stats tables will appear automatically",
    supportBtn: "Support / Contact",
    kofiBtn: "Support me on Ko-fi",
  },
  fr: {
    whatDoesTitle: "📊 Que fait cette extension ?",
    whatDoesText:
      "Calcule automatiquement les statistiques de <strong>Maîtrise</strong> et de <strong>Résistance</strong> sur les cartes d'équipement du Zenith Wakfu Builder.",
    feature1: "Somme automatique des maîtrises positives",
    feature2: "Détection des maîtrises négatives",
    feature3: "Calcul du total net",
    feature4: "Même fonctionnalité pour les résistances",
    howToUseTitle: "📝 Comment utiliser",
    step1:
      'Visitez <a href="https://www.zenithwakfu.com/builder" target="_blank">zenithwakfu.com/builder</a>',
    step2: "Parcourez les équipements",
    step3: "Les tableaux de statistiques apparaîtront automatiquement",
    supportBtn: "Support / Contact",
    kofiBtn: "Soutenez-moi sur Ko-fi",
  },
};

// Función para cambiar el idioma
function changeLanguage(lang) {
  // Guardar preferencia
  chrome.storage.sync.set({ language: lang });

  // Actualizar textos
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  // Actualizar el select
  const select = document.getElementById("languageSelect");
  if (select) {
    select.value = lang;
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  console.log("Zenith Wakfu Stats Calculator cargado");

  const languageSelect = document.getElementById("languageSelect");

  // Cargar idioma guardado
  chrome.storage.sync.get(["language"], (result) => {
    const savedLang = result.language || "es";
    languageSelect.value = savedLang;
    changeLanguage(savedLang);
  });

  // Event listener para el select de idioma
  languageSelect.addEventListener("change", (e) => {
    const lang = e.target.value;
    changeLanguage(lang);
  });
});
