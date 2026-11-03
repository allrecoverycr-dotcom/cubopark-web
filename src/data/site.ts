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
  maps: 'https://www.google.com/maps/search/?api=1&query=Calle+Potrerillos+San+Rafael+Alajuela+Costa+Rica',
  waze: 'https://waze.com/ul?q=Calle%20Potrerillos%20San%20Rafael%20Alajuela',
};

export const waLink = (text?: string) =>
  SITE.contact.whatsapp ? `https://wa.me/${SITE.contact.whatsapp}${text ? '?text=' + encodeURIComponent(text) : ''}` : null;
