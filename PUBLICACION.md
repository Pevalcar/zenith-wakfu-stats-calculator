# Guía para Publicar en Chrome Web Store

## Requisitos previos

1. **Cuenta de Google Developer**
   - Visita: https://chrome.google.com/webstore/devconsole
   - Paga la tarifa única de registro ($5 USD)

2. **Archivos necesarios** ✅
   - `manifest.json` - Ya configurado
   - Código fuente - Ya completo
   - Iconos - `icon.png` (necesitas 3 tamaños)
   - Screenshots - Necesitas capturar pantallas
   - Activos visuales incluidos en este repo:
     - `presentacion.png` → Úsalo como imagen vistosa/promocional y primer screenshot
     - `ejemplo.png` → Úsalo como screenshot de ejemplo dentro de la ficha

## Paso 1: Preparar Iconos

Necesitas crear iconos en estos tamaños:
- **16x16 px** - Favicon
- **48x48 px** - Página de extensiones
- **128x128 px** - Chrome Web Store

### Opción A: Usar herramienta online
1. Ve a https://www.iloveimg.com/resize-image
2. Sube tu `icon.png` actual
3. Crea las 3 versiones

### Opción B: Usar PowerShell (si tienes ImageMagick)
```powershell
# Instalar ImageMagick
winget install ImageMagick.ImageMagick

# Crear iconos
magick icon.png -resize 16x16 icon-16.png
magick icon.png -resize 48x48 icon-48.png
magick icon.png -resize 128x128 icon-128.png
```

Luego actualiza `manifest.json`:
```json
"icons": {
  "16": "icon-16.png",
  "48": "icon-48.png",
  "128": "icon-128.png"
}
```

## Paso 2: Capturar Screenshots

**Requisitos de Chrome Web Store:**
- Mínimo: 1 screenshot
- Recomendado: 3-5 screenshots
- Tamaño: 1280x800 o 640x400 px
- Formato: PNG o JPG

**Qué capturar:**
1. Vista del popup de la extensión
2. Ejemplo de tabla de dominios en una tarjeta
3. Ejemplo de tabla de resistencias en una tarjeta
4. Vista completa del builder con varias tarjetas procesadas

Puedes comenzar usando los archivos incluidos:
- `presentacion.png` (como primer screenshot y/o tile promocional)
- `ejemplo.png` (como screenshot de ejemplo)

**Cómo capturar:**
1. Ve a https://www.zenithwakfu.com/builder
2. Abre DevTools (F12) y usa el modo responsive
3. Configura tamaño 1280x800
4. Captura con Snipping Tool (Win + Shift + S)

Opcional: redimensiona los activos incluidos a los tamaños recomendados con ImageMagick:

```powershell
# Si no lo tienes
winget install ImageMagick.ImageMagick

# Crear versiones para la tienda
magick presentacion.png -resize 1280x800 store-hero-1280x800.png
magick presentacion.png -resize 1400x560 store-promo-1400x560.png
magick ejemplo.png -resize 1280x800 store-example-1280x800.png
```

Nota: Chrome Web Store no muestra imágenes incrustadas en la descripción larga; debes subirlas en la sección de “Gráficos de la tienda”.

## Paso 3: Empaquetar la Extensión

### Opción A: Subir carpeta directamente (Recomendado)
1. Crea un archivo ZIP con estos archivos:
   ```
   zenith-wakfu-stats.zip
   ├── manifest.json
   ├── content.js
   ├── popup.html
   ├── popup.css
   ├── popup.js
   ├── icon-16.png
   ├── icon-48.png
   ├── icon-128.png
   ├── README.md
   └── PRIVACY.md
   ```

2. Usa PowerShell:
   ```powershell
   Compress-Archive -Path manifest.json,content.js,popup.html,popup.css,popup.js,icon*.png,README.md,PRIVACY.md -DestinationPath zenith-wakfu-stats.zip
   ```

### Opción B: Empaquetar desde Chrome
1. Ve a `chrome://extensions/`
2. Clic en "Empaquetar extensión"
3. Selecciona la carpeta de la extensión
4. Se generará un `.crx` (no lo necesitas para Web Store)

## Paso 4: Publicar en Chrome Web Store

1. **Iniciar sesión**
   - Ve a https://chrome.google.com/webstore/devconsole
   - Inicia sesión con tu cuenta de Google

2. **Crear nuevo elemento**
   - Clic en "Nuevo elemento"
   - Sube el archivo ZIP

3. **Completar información**

   **Detalles del producto:**
   - **Nombre**: Zenith Wakfu Stats Calculator
   - **Resumen**: Calcula automáticamente estadísticas de Dominio y Resistencia en Zenith Wakfu Builder
   - **Descripción detallada**: (Copia de README.md)
   ```
   Extensión para Chrome que calcula automáticamente las estadísticas de Dominio y Resistencia en las tarjetas de equipamiento del Zenith Wakfu Builder.
   
   🎯 CARACTERÍSTICAS:
   ✅ Suma automática de dominios positivos
   ⚠️ Detección de dominios negativos
   🔢 Cálculo de total neto
   🛡️ Misma funcionalidad para resistencias
   
   📊 CÓMO FUNCIONA:
   La extensión detecta automáticamente las estadísticas y muestra tablas organizadas con:
   - Dominio/Resistencia sumado (positivos)
   - Dominio/Resistencia negativo (si hay)
   - Total neto
   
   💡 USO:
   1. Instala la extensión
   2. Visita zenithwakfu.com/builder
   3. Las tablas aparecerán automáticamente
   
   🔒 PRIVACIDAD:
   - No recopila datos personales
   - Todo el procesamiento es local
   - Sin seguimiento ni publicidad
   ```

   **Categoría**: Productividad

   **Idioma**: Español

4. **Gráficos de la tienda**
   - **Icono**: icon-128.png
   - **Imagen promocional (tile/marquee)**: 1400x560 (opcional). Recomendado usar `presentacion.png` redimensionada.
   - **Screenshots**: 3-5 en 1280x800. Puedes usar `presentacion.png` y `ejemplo.png` como base.

5. **Privacidad**
   - **Justificación de permisos**:
     - `storage`: Para configuración futura (actualmente no usado)
     - `host_permissions (zenithwakfu.com)`: Necesario para inyectar código que calcula estadísticas
   
   - **Política de privacidad**: Pega la URL de tu PRIVACY.md o copia el contenido

6. **Distribución**
   - **Visibilidad**: Pública
   - **Regiones**: Todas (o solo países hispanohablantes)

## Paso 5: Revisión

1. **Tiempo de revisión**: 1-3 días hábiles
2. **Posibles rechazos**:
   - Iconos de baja calidad → Usa iconos de mayor resolución
   - Falta de screenshots → Agrega más capturas
   - Permisos sin justificar → Ya están justificados en paso 4

3. **Si es rechazada**:
   - Lee el correo de Google
   - Corrige los problemas
   - Vuelve a subir

## Paso 6: Post-Publicación

1. **Actualizar README.md** con el link de Chrome Web Store
2. **Promocionar**:
   - Foros de Wakfu
   - Reddit: r/wakfu
   - Discord de Zenith Wakfu

## Textos listos para la ficha

Usa estos textos en la ficha de la tienda. Recuerda que puedes configurar varios idiomas en Chrome Web Store.

### Español (principal)
- Resumen (≤132 caracteres):
   Calcula automáticamente Dominios y Resistencias en Zenith Wakfu Builder con tablas claras y soporte multiidioma.

- Descripción larga:
   Extensión para Chrome que calcula automáticamente las estadísticas de Dominio y Resistencia en las tarjetas de equipamiento del Zenith Wakfu Builder.

   Características:
   - Suma automática de dominios positivos (incluye multiplicadores por elementos)
   - Detección de dominios negativos y total neto
   - Lógica equivalente para resistencias (elemental ×4 y por elementos)
   - Soporte multiidioma: Español, Inglés y Francés

   Cómo usar:
   1) Instala la extensión
   2) Visita https://www.zenithwakfu.com/builder
   3) Las tablas aparecerán automáticamente en cada tarjeta de equipamiento

   Privacidad:
   - No recopila datos personales
   - El procesamiento ocurre localmente en tu navegador

### English
- Short description (≤132 chars):
   Automatically computes Mastery and Resistances on Zenith Wakfu Builder with clear tables and multi-language support.

- Long description:
   Chrome extension that automatically calculates Mastery and Resistance stats on equipment cards in the Zenith Wakfu Builder.

   Features:
   - Automatic sum of positive masteries (includes per-element multipliers)
   - Negative masteries detection and net total
   - Same logic for resistances (elemental ×4 and per elements)
   - Multi-language support: Spanish, English, and French

   How to use:
   1) Install the extension
   2) Visit https://www.zenithwakfu.com/builder
   3) Tables appear automatically on each equipment card

   Privacy:
   - No personal data collection
   - All processing happens locally in your browser

### Français
- Description courte (≤132 caractères) :
   Calcule automatiquement Maîtrises et Résistances sur Zenith Wakfu Builder avec des tableaux clairs et multilingues.

- Description longue :
   Extension Chrome qui calcule automatiquement les statistiques de Maîtrise et de Résistance sur les cartes d’équipement du Zenith Wakfu Builder.

   Fonctionnalités :
   - Somme automatique des maîtrises positives (inclut les multiplicateurs par éléments)
   - Détection des maîtrises négatives et total net
   - Même logique pour les résistances (élémentaire ×4 et par éléments)
   - Support multilingue : espagnol, anglais et français

   Utilisation :
   1) Installez l’extension
   2) Visitez https://www.zenithwakfu.com/builder
   3) Les tableaux apparaissent automatiquement sur chaque carte d’équipement

   Confidentialité :
   - Aucune collecte de données personnelles
   - Tout le traitement est local dans votre navigateur

## Actualizaciones Futuras

Para actualizar la extensión:
1. Incrementa el número de versión en `manifest.json`
2. Crea nuevo ZIP
3. En Chrome Web Store Dashboard → Tu extensión → "Cargar paquete actualizado"

## Checklist Final

Antes de publicar, verifica:

- [ ] `manifest.json` tiene versión correcta (1.0.1)
- [ ] Iconos en 3 tamaños (16, 48, 128)
- [ ] 3-5 screenshots de alta calidad
- [ ] README.md actualizado
- [ ] PRIVACY.md incluido
- [ ] Correo de contacto correcto (geoememsoluciones@gmail.com)
- [ ] Probado en Chrome sin errores
- [ ] Archivo ZIP creado correctamente

## Recursos Útiles

- **Developer Dashboard**: https://chrome.google.com/webstore/devconsole
- **Guía oficial**: https://developer.chrome.com/docs/webstore/publish/
- **Políticas**: https://developer.chrome.com/docs/webstore/program-policies/

## Soporte

Si necesitas ayuda:
- **Email**: geoememsoluciones@gmail.com
- **GitHub**: https://github.com/Pevalcar
- **Ko-fi**: https://ko-fi.com/pevalcar
