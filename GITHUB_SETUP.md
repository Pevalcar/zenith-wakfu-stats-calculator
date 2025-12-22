# Configuración de GitHub para Zenith Wakfu Stats Calculator

## Opción 1: Crear repositorio desde GitHub.com (Recomendado)

1. **Ir a GitHub**: https://github.com/new

2. **Configurar el repositorio**:
   - Repository name: `zenith-wakfu-stats-calculator`
   - Description: `Extensión para Chrome/Opera que calcula Dominios y Resistencias en Zenith Wakfu Builder`
   - Visibilidad: **Public** (para que aparezca el copyright automático)
   - ✅ **Add a README file**: NO (ya lo tienes)
   - ✅ **Add .gitignore**: NO (no necesitas por ahora)
   - ✅ **Choose a license**: Selecciona **MIT License**
     - Esto generará automáticamente el copyright con tu nombre y el año actual

3. **Conectar tu repo local**:
   ```powershell
   git remote add origin https://github.com/Pevalcar/zenith-wakfu-stats-calculator.git
   git branch -M main
   git push -u origin main
   ```

4. **GitHub generará automáticamente**:
   - `LICENSE` con copyright © 2025 Pevalcar
   - Badge de licencia en el README
   - Protección de copyright en la metadata del repo

## Opción 2: Usar GitHub CLI (si lo tienes instalado)

```powershell
# Verificar si está instalado
gh --version

# Crear el repo con licencia MIT (genera copyright automático)
gh repo create zenith-wakfu-stats-calculator --public --description "Extensión para Chrome/Opera que calcula Dominios y Resistencias en Zenith Wakfu Builder" --license mit --source=. --remote=origin --push
```

## Después de publicar en GitHub

1. **Actualizar README.md** con el badge de licencia:
   ```markdown
   ![License](https://img.shields.io/github/license/Pevalcar/zenith-wakfu-stats-calculator)
   ```

2. **Actualizar manifest.json y package** con la URL correcta:
   - `homepage_url` ya apunta a tu GitHub

3. **Habilitar GitHub Pages** (opcional):
   - Settings → Pages → Deploy from main branch
   - Puedes hostear la documentación o landing page

## Notas importantes

- La licencia MIT generada por GitHub incluirá automáticamente:
  - Copyright © 2025 Pevalcar
  - Permisos de uso, modificación y distribución
  - Disclaimer de garantías

- El copyright aparecerá en:
  - Archivo `LICENSE` en el root
  - Metadata del repositorio
  - API de GitHub

- Para actualizaciones futuras, GitHub actualizará el año automáticamente en releases

## Checklist Post-GitHub

- [ ] Repositorio creado en GitHub
- [ ] LICENSE generado con copyright
- [ ] Código subido (push)
- [ ] README.md visible con imágenes
- [ ] URL del repo actualizada en manifest.json
- [ ] Badge de licencia agregado al README (opcional)
- [ ] Releases configurado para versiones futuras
