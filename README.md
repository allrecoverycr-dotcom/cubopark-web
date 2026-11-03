# Cubo Park Condominio · cuboparkcr.com

Sitio web bilingüe (español / inglés) de Cubo Park, hecho con [Astro](https://astro.build) y publicado en Hostinger.

## Cómo se publica
1. Los cambios se guardan en la rama `main`.
2. GitHub Actions compila el sitio (`npm run build`) y publica el resultado en la rama `deploy`.
3. Hostinger (hPanel › Sitio web › Avanzado › GIT) despliega la rama `deploy` en `public_html`.

## Dónde se edita cada cosa
| Qué | Archivo |
|---|---|
| Precios, áreas, estado de cada finca (vendida, en venta…) | `src/data/lots.ts` |
| Teléfono, WhatsApp, correo, horario | `src/data/site.ts` (y `pending: false` cuando estén completos) |
| Correo que recibe el formulario | `public/contacto.php` (`$TO`) |
| Textos de cada página | `src/views/*.astro` (cada texto está en español e inglés) |
| Fotos | `public/img/` (WebP en dos tamaños: `nombre.webp` 2000 px y `nombre-sm.webp` 900 px) |
| Planos catastrados en PDF | `public/docs/` |
| Estilos | `src/styles/global.css` |

## Direcciones
- Español: `/`, `/proyecto/`, `/disponibilidad/`, `/bodega/`, `/lotes/ffm-ib-6/`, `/galeria/`, `/ubicacion/`, `/contacto/`
- Inglés: `/en/`, `/en/project/`, `/en/availability/`, `/en/warehouse/`, `/en/lots/ffm-ib-6/`, `/en/gallery/`, `/en/location/`, `/en/contact/`

## Desarrollo local
```
npm install
npm run dev
```

## Caché
Las imágenes se guardan en caché 1 año: si cambia una foto, súbala con **otro nombre**. El script `app.js` se versiona automáticamente en cada compilación.
