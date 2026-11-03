// Fincas filiales disponibles. Precios en USD. Áreas según planos catastrados.
// Para marcar una finca como vendida cambie status_es / status_en.
export type Lot = {
  id: string;
  code: string;
  kind: 'house' | 'lot' | 'warehouse';
  name_es: string;
  name_en: string;
  status_es: string;
  status_en: string;
  price: number;
  lot?: number;
  green?: number;
  total?: number;
  zv?: string;
  built?: number;
  land?: number;
  rent?: number;
  fee?: number;
  img: string;
  imgs?: string[];
};

export const LOTS: Record<string, Lot> = {
  ib4: { id: 'ib4', code: 'FFM-IB-4', kind: 'house', name_es: 'Terreno y casa', name_en: 'Land & house', lot: 5452.3, green: 0, total: 5452.3, price: 2200000,
    status_es: 'En venta', status_en: 'For sale', img: 'casa-ib4', imgs: ['casa-ib4', 'casa-ib4-2', 'casa-entorno'] },
  ib5: { id: 'ib5', code: 'FFM-IB-5', kind: 'warehouse', name_es: 'Bodega industrial', name_en: 'Industrial warehouse', built: 5500, land: 4231, price: 5600000, rent: 8, fee: 1,
    status_es: 'Venta o alquiler', status_en: 'Sale or lease', img: 'bodega-aerea' },
  ib6: { id: 'ib6', code: 'FFM-IB-6', kind: 'lot', name_es: 'Lote industrial', name_en: 'Industrial lot', lot: 3631.08, green: 1839.36, total: 5470.44, price: 1367610, zv: '2',
    status_es: 'En venta', status_en: 'For sale', img: 'terreno-aereo', imgs: ['terreno-aereo', 'calle-interna', 'terreno-aereo-2'] },
  ib7: { id: 'ib7', code: 'FFM-IB-7', kind: 'lot', name_es: 'Lote industrial', name_en: 'Industrial lot', lot: 3769.6, green: 2182.16, total: 5951.76, price: 1487940, zv: '3',
    status_es: 'En venta', status_en: 'For sale', img: 'terreno-aereo-2', imgs: ['terreno-aereo-2', 'calle-interna-3', 'terreno-aereo'] },
  ib8: { id: 'ib8', code: 'FFM-IB-8', kind: 'lot', name_es: 'Lote industrial', name_en: 'Industrial lot', lot: 3208.66, green: 945.47, total: 4154.13, price: 1038532, zv: '4',
    status_es: 'En venta', status_en: 'For sale', img: 'calle-interna-2', imgs: ['calle-interna-2', 'terreno-aereo', 'calle-interna-3'] },
};

export const LOT_IDS = ['ib4', 'ib6', 'ib7', 'ib8'];
export const ppm = (l: Lot) => l.price / (l.total || 1);
export const LAND_TOTAL = LOT_IDS.reduce((s, k) => s + (LOTS[k].total || 0), 0);

export const WAREHOUSE = (() => {
  const w = LOTS.ib5;
  const rent = (w.built || 0) * (w.rent || 0);
  const iva = rent * 0.13;
  const fee = (w.built || 0) * (w.fee || 0);
  return { rent, iva, fee, total: rent + iva + fee };
})();

// Polígonos sobre img/masterplan-3d.webp (viewBox 4000x1040), tomados del PSB del master plan.
const OY = 420;
const P = (pts: number[][]) => pts.map(([x, y]) => [x, y - OY]);
export const POLY: Record<string, number[][]> = {
  ib8: P([[120, 971], [323, 990], [622, 850], [470, 835]]),
  ib7: P([[584, 974], [750, 861], [1202, 884], [1042, 991]]),
  ib6: P([[1224, 1005], [1390, 892], [1852, 922], [1737, 1039]]),
  ib5: P([[1966, 1079], [2057, 925], [2752, 995], [2758, 1162]]),
  ib4: P([[2961, 1195], [2908, 1022], [3714, 1083], [3921, 1294]]),
};
// [x texto, y texto, x línea, y1, y2]
export const TAGS: Record<string, number[]> = {
  ib8: [471, 700 - OY, 460, 726 - OY, 892 - OY],
  ib7: [898, 732 - OY, 900, 747 - OY, 903 - OY],
  ib6: [1566, 720 - OY, 1572, 735 - OY, 957 - OY],
  ib5: [2387, 767 - OY, 2383, 787 - OY, 1015 - OY],
  ib4: [3293, 890 - OY, 3286, 912 - OY, 1112 - OY],
};

export const GAL: [string, string, string, string][] = [
  ['aerial-panorama', 'aerea', 'Vista aérea del condominio y su entorno', 'Aerial view of the condominium and surroundings'],
  ['bodega-aerea', 'aerea exterior', 'Bodega FFM-IB-5, vista aérea', 'Warehouse FFM-IB-5, aerial view'],
  ['bodega-aerea-2', 'aerea exterior', 'Cubierta con lucernarios', 'Roof with skylights'],
  ['entorno-aereo', 'aerea terreno', 'Lotes disponibles y calle interna', 'Available lots and internal road'],
  ['terreno-aereo', 'aerea terreno', 'Lotes FFM-IB-6, 7 y 8', 'Lots FFM-IB-6, 7 and 8'],
  ['bodega-fachada', 'exterior', 'Fachada lateral de la bodega', 'Warehouse side façade'],
  ['bodega-acceso', 'exterior', 'Acceso y estacionamientos', 'Entrance and parking'],
  ['bodega-calle', 'exterior', 'Calle interna frente a la bodega', 'Internal road by the warehouse'],
  ['nave-panoramica', 'interior', 'Nave principal', 'Main hall'],
  ['nave-mezzanine', 'interior', 'Mezzanine y oficinas de segundo nivel', 'Mezzanine and second-floor offices'],
  ['nave-oficinas', 'interior oficinas', 'Cortina de acceso y oficinas en dos niveles', 'Roll-up door and two-level offices'],
  ['nave-amplia', 'interior', 'Espacio libre de producción', 'Open production floor'],
  ['nave-escaleras', 'interior', 'Escaleras metálicas a mezzanine', 'Steel stairs to mezzanine'],
  ['pasarela', 'interior', 'Pasarelas en mezzanine', 'Mezzanine walkways'],
  ['oficina-vidrio', 'oficinas', 'Oficinas con cerramiento de vidrio', 'Glass-enclosed offices'],
  ['oficina-amplia', 'oficinas', 'Oficina de planta abierta', 'Open-plan office'],
  ['oficina-2', 'oficinas', 'Sala de oficinas', 'Office suite'],
  ['escalera', 'oficinas', 'Escalera interna', 'Internal staircase'],
  ['recepcion', 'oficinas', 'Recepción', 'Reception'],
  ['area-servicio', 'oficinas', 'Área de servicio', 'Service area'],
  ['bodega-jardin', 'exterior terreno', 'Zonas verdes del condominio', 'Condominium green areas'],
  ['calle-interna', 'terreno', 'Calle interna asfaltada', 'Paved internal road'],
  ['calle-interna-3', 'terreno', 'Frente de los lotes', 'Lot frontage'],
  ['casa-ib4', 'aerea terreno', 'Finca FFM-IB-4, terreno y casa', 'Lot FFM-IB-4, land and house'],
];
export const CAP: Record<string, [string, string]> = Object.fromEntries(GAL.map((g) => [g[0], [g[2], g[3]]]));

// Compra del proyecto completo (las 5 fincas disponibles).
// Por defecto el precio es la suma de las fincas; para ofrecer un precio de paquete distinto, cámbielo en PACKAGE_PRICE.
export const ALL_IDS = ['ib4', 'ib5', 'ib6', 'ib7', 'ib8'];
export const SUM_PRICE = ALL_IDS.reduce((s, k) => s + LOTS[k].price, 0);
export const PACKAGE_PRICE: number | null = null;
export const BUNDLE = {
  price: PACKAGE_PRICE ?? SUM_PRICE,
  land: ALL_IDS.reduce((s, k) => s + (LOTS[k].kind === 'warehouse' ? LOTS[k].land || 0 : LOTS[k].total || 0), 0),
  built: LOTS.ib5.built || 0,
  count: ALL_IDS.length,
};
