// Datos generales del sitio. Para actualizar contacto, cambie los valores y ponga `pending: false`.
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
    pending: true, // true = se muestran marcados como pendientes
    phone: '+506 0000-0000',
    whatsapp: '50600000000', // solo dígitos, con código de país
    email: 'correo@cuboparkcr.com',
    hours_es: 'Lun a vie · por confirmar',
    hours_en: 'Mon–Fri · TBC',
  },
  // Correo que recibe las solicitudes del formulario (ver public/contacto.php)
  maps: 'https://www.google.com/maps/search/?api=1&query=Calle+Potrerillos+San+Rafael+Alajuela+Costa+Rica',
  waze: 'https://waze.com/ul?q=Calle%20Potrerillos%20San%20Rafael%20Alajuela',
};
