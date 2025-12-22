# Documentación Técnica - Content Script

## Descripción General

El script `content.js` se inyecta en las páginas de Zenith Wakfu (builder) y automaticamente procesa las tarjetas de equipamiento para agregar dos sumas:

1. **TOTAL DOMINIO** - Suma de todos los dominios
2. **TOTAL RESISTENCIA** - Suma de todas las resistencias con reglas especiales

## Funcionalidades

### 1. Suma de Dominios

Suma **todos los valores** que incluyan las palabras clave:
- `dominio distancia`
- `dominio cuerpo a cuerpo`
- `dominio elemental`
- `dominio espalda`
- `daño` (daño neutral, fuego, agua, aire, tierra)

**Resultado**: Un único número que es la suma total de todos estos valores.

### 2. Suma de Resistencias

Las resistencias tienen **reglas especiales**:

#### Resistencia Elemental
- **Valor**: Si aparece "Resistencia elemental"
- **Multiplicador**: **×4** (suma a los 4 elementos: fuego, agua, aire, tierra)

#### Resistencias Específicas
- Resistencia fuego: suma **1 vez**
- Resistencia agua: suma **1 vez**
- Resistencia aire: suma **1 vez**
- Resistencia tierra: suma **1 vez**

**Ejemplo:**
```
45 Resistencia elemental → 45 × 4 = 180
10 Resistencia fuego → 10 × 1 = 10
Total = 190
```

**Si solo hay resistencias específicas sin elemental:**
```
10 Resistencia fuego
10 Resistencia agua
10 Resistencia aire
10 Resistencia tierra
Total = 40
```

## Estructura del Código

### Funciones Principales

#### `parseStatistic(text)`
Extrae el valor y tipo de una línea de estadística.

```javascript
Input:  "45 Resistencia elemental"
Output: {
  value: 45,
  type: "resistencia elemental",
  fullText: "45 Resistencia elemental"
}
```

#### `sumDomains(stats)`
Suma todos los dominios encontrados.

```javascript
Input:  Array de estadísticas parseadas
Output: 104 (ejemplo)
```

#### `sumResistances(stats)`
Suma resistencias aplicando las reglas especiales.

```javascript
Output: {
  total: 190,
  breakdown: {
    elemental: 45,
    fire: 0,
    water: 0,
    air: 0,
    earth: 0
  }
}
```

#### `processEquipmentCard(card)`
Procesa una tarjeta individual y agrega los sumarios.

#### `processAllEquipmentCards()`
Procesa todas las tarjetas en la página.

### Observador de Mutaciones

El script monitorea cambios en el DOM para procesar nuevas tarjetas dinámicamente:

```javascript
const observer = new MutationObserver((mutations) => {
  // Detecta nuevas tarjetas y las procesa
});
```

## Visualización

Los sumarios se muestran en la tarjeta así:

```
📊 TOTAL DOMINIO: 104
🛡️ TOTAL RESISTENCIA: 190
```

### Estilos
- Fondo semi-transparente oscuro
- Texto verde para dominios (#4ade80)
- Texto azul para resistencias (#60a5fa)
- Separador visual con línea superior

## Integración

El script está configurado en `manifest.json`:

```json
"content_scripts": [
  {
    "matches": ["https://www.zenithwakfu.com/*"],
    "js": ["content.js"],
    "run_at": "document_start"
  }
]
```

### Parámetros
- **matches**: Se ejecuta solo en zenithwakfu.com
- **run_at**: `document_start` para máxima compatibilidad

## Monitoreo y Logs

El script registra información en la consola:

```javascript
[Zenith Wakfu] Procesadas 12 tarjetas de equipamiento
[Zenith Wakfu] Observador de mutaciones configurado
[Zenith Wakfu] Estilos inyectados
[Zenith Wakfu] Script de contenido inicializado
```

## Prevención de Duplicados

El script agrega la clase `equipment-processed` a las tarjetas procesadas para evitar procesarlas múltiples veces.

## Compatibilidad

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Opera 74+
- ✅ Carga dinámica de contenido (AJAX)
- ✅ Observa cambios en el DOM

## Casos de Uso

### Caso 1: Equipamiento con múltiples dominios
```
104 Dominio distancia
50 Daño fuego
30 Daño agua
→ TOTAL DOMINIO: 184
```

### Caso 2: Resistencias mixtas
```
45 Resistencia elemental
15 Resistencia fuego
→ Resistencia elemental: 45 × 4 = 180
→ Resistencia fuego: 15 × 1 = 15
→ TOTAL RESISTENCIA: 195
```

### Caso 3: Sin sumarios
Si la tarjeta no tiene dominios ni resistencias, no se agregan sumarios.

## Mantenimiento Futuro

Para agregar nuevos tipos de estadísticas:

1. Modificar `DOMAIN_KEYWORDS` o `RESISTANCE_KEYWORDS`
2. Actualizar la función `parseStatistic()` si es necesario
3. Ajustar las funciones de suma según las nuevas reglas

