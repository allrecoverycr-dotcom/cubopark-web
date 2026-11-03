export type Lang = 'es' | 'en';

// Rutas por idioma. Cada página conoce su equivalente en el otro idioma (hreflang y selector ES/EN).
export const ROUTES = {
  home: { es: '/', en: '/en/' },
  project: { es: '/proyecto/', en: '/en/project/' },
  availability: { es: '/disponibilidad/', en: '/en/availability/' },
  warehouse: { es: '/bodega/', en: '/en/warehouse/' },
  gallery: { es: '/galeria/', en: '/en/gallery/' },
  location: { es: '/ubicacion/', en: '/en/location/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
} as const;
export type RouteKey = keyof typeof ROUTES | `lot:${string}`;

export function href(key: RouteKey, lang: Lang): string {
  if (key.startsWith('lot:')) {
    const id = key.slice(4);
    if (id === 'ib5') return ROUTES.warehouse[lang];
    const slug = 'ffm-ib-' + id.slice(2);
    return lang === 'es' ? `/lotes/${slug}/` : `/en/lots/${slug}/`;
  }
  return ROUTES[key as keyof typeof ROUTES][lang];
}

export const NAV: [RouteKey, string, string][] = [
  ['home', 'Inicio', 'Home'],
  ['project', 'El Proyecto', 'The Project'],
  ['availability', 'Disponibilidad', 'Availability'],
  ['warehouse', 'La Bodega', 'The Warehouse'],
  ['gallery', 'Galería', 'Gallery'],
  ['location', 'Ubicación', 'Location'],
  ['contact', 'Contacto', 'Contact'],
];

export const useT = (lang: Lang) => (es: string, en: string) => (lang === 'es' ? es : en);
export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
export const m2 = (n: number, d = 2) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' m²';

// Enlace al formulario con la propiedad y el tipo de solicitud ya seleccionados.
//   interes: ib4 | bodega | bodega-alquiler | ib6 | ib7 | ib8 | todo | otro
//   tipo:    info (solicitar información) | visita (solicitar visita) | alquiler (condiciones de alquiler)
export type AskType = 'info' | 'visita' | 'alquiler';
export const ask = (lang: Lang, interes?: string, tipo: AskType = 'info') => {
  const q = new URLSearchParams();
  if (interes) q.set('interes', interes);
  q.set('tipo', tipo);
  return href('contact', lang) + '?' + q.toString() + '#formulario';
};
// Valor del selector "Me interesa" para cada finca.
export const interestOf = (id: string) => (id === 'ib5' ? 'bodega' : id);
