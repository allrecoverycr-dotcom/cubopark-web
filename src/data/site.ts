// Datos generales del sitio — configuración central editable.
//
// CONTACTO: mientras un dato valga `null` NO se muestra en el sitio público
// (no se publican números ni correos de ejemplo). Para activarlo, escriba el valor real:
//   phone:    '+506 8888-8888'        → aparece en el pie de página y en Contacto
//   whatsapp: '50688888888'           → solo dígitos con código de país; activa el botón flotante y los botones de WhatsApp
//   email:    'ventas@cuboparkcr.com' → aparece en el pie de página y en Contacto
//   hours_es / hours_en               → horario de atención / visitas
//
// PENDIENTES (validar con el propietario antes de completar):
//   - Teléfono comercial, WhatsApp, horario de atención y de visitas
//   - Correo que recibe el formulario: info@cuboparkcr.com (variable $TO en public/contacto.php)
export const SITE = {
  name: 'Cubo Park Condominio',
  domain: 'https://cuboparkcr.com',
  address: {
    street: 'Calle Potrerillos',
    locality: 'San Rafael',
    region: 'Alajuela',
    country: 'CR',
  },
  contact: {
    phone: null as string | null,
    whatsapp: null as string | null,
    email: 'info@cuboparkcr.com' as string | null,
    hours_es: null as string | null,
    hours_en: null as string | null,
  },
  // Ubicación de la bodega (FFM-IB-5) en Google Maps, sobre Calle Potrerillos.
  geo: { lat: 9.96663, lng: -84.206073 },
  // Cómo llegar: abre la ruta hacia el condominio.
  maps: 'https://www.google.com/maps/dir/?api=1&destination=9.96663,-84.206073',
  waze: 'https://waze.com/ul?ll=9.96663,-84.206073&navigate=yes',
  // Enlace enviado por el propietario: Calle Potrerillos con la vista aérea 360° del condominio.
  view360: 'https://www.google.com/maps/place/C.+Potrerillos/@9.9651933,-84.2054825,867a,75y,335.34h,91.12t/data=!3m8!1e1!3m6!1sCIHM0ogKEICAgICJt-nG8gE!2e10!3e11!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAM4Q-U9YUGmPJSjNPkvJvAo7pDH2UsmCcRn2jrot7pMDMvDiG7BzguZ7ZhcLE_o1H7eqRxVrR69Ke_BwYQ4jD07EZKuEH3BEhzlE0NIEyaJI9S2SYUlV0yIiFPnI6Ak_cO-7J9fWHvIT%3Dw900-h600-k-no-pi-1.124255311911213-ya310.04138632745816-ro0-fo100!7i5760!8i2880!4m6!3m5!1s0x8fa0f96b00b50d85:0xc98027b1cf445960!8m2!3d9.967664!4d-84.2004095!16s%2Fg%2F1hjh2t6r1',
};

export const waLink = (text?: string) =>
  SITE.contact.whatsapp ? `https://wa.me/${SITE.contact.whatsapp}${text ? '?text=' + encodeURIComponent(text) : ''}` : null;
