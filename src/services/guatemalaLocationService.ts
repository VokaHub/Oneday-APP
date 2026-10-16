/**
 * Módulo de ubicación para Guatemala
 */

export interface UbicacionConfig {
  tipo: 'presencial' | 'remoto';
  direccion?: string;
  zonaCiudad?: string;
}

export interface GrupoUbicacion {
  grupo: string;
  lugares: string[];
}

export const GRUPOS_UBICACIONES_GUATEMALA: GrupoUbicacion[] = [
  {
    grupo: 'Zonas de Ciudad de Guatemala',
    lugares: [
      'Zona 1 - Centro Histórico',
      'Zona 2 - Ciudad Nueva',
      'Zona 4 - Cuatro Grados Norte',
      'Zona 5',
      'Zona 7',
      'Zona 9',
      'Zona 10 - Zona Viva',
      'Zona 11 - Mariscal / Roosevelt',
      'Zona 12',
      'Zona 13 - Aurora / Aeropuerto',
      'Zona 14 - La Cañada',
      'Zona 15 - Vista Hermosa',
      'Zona 16 - Cayalá / San Gaspar',
      'Zona 17',
      'Zona 18',
    ],
  },
  {
    grupo: 'Municipios y Área Metropolitana',
    lugares: [
      'Carretera a El Salvador',
      'Santa Catarina Pinula',
      'Fraijanes',
      'Mixco (San Cristóbal / El Naranjo)',
      'Villa Nueva',
      'San Miguel Petapa',
      'Villa Canales',
      'Amatitlán',
    ],
  },
  {
    grupo: 'Departamentos y Ciudades Principales',
    lugares: [
      'Antigua Guatemala (Sacatepéquez)',
      'Quetzaltenango (Xela)',
      'Escuintla',
      'Chimaltenango',
      'Cobán (Alta Verapaz)',
      'Mazatenango (Suchitepéquez)',
      'Retalhuleu',
      'Puerto Barrios (Izabal)',
      'Petén (Flores / Santa Elena)',
      'Toda Guatemala (Nacional)',
    ],
  },
];

export function formatearUbicacion(config: UbicacionConfig): string {
  if (config.tipo === 'remoto') {
    return 'Remoto';
  }
  const partes = [config.direccion?.trim(), config.zonaCiudad?.trim()].filter(Boolean);
  return partes.join(', ') || 'No especificada';
}
