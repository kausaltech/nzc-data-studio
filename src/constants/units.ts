// Uses unit.standard
export const DECIMAL_PRECISION_BY_UNIT = {
  cap: 0,
  '%/a': 1,
  'km²': 0,
  'Mpkm/a': 0,
  'p/v': 1,
  'g/vkm': 2,
  v: 0, // vehicle
  '%': 1,
  'Mkm·t/a': 0,
  ksqm: 0,
  'kWh/m²/a': 0,
  'GWh/a': 0,
  'g/kWh': 2,
  '€/MWh': 0,
  'kWh/kW/a': 0,
  't/a': 0,
  'kg/t': 2,
  '€/kWh': 2,
  'kt/a': 2,
  pcs: 0,
  '': 0, // Years have no unit (empty string)
};

/**
 * Temporarily override some unit labels that have no backend human readable string
 */
export const UNIT_LABELS = {
  thousand_square_meters: 'thousand square meters',
  'gigawatt_hour/year': 'gigawatt hour/year',
  'EUR/megawatt_hour': 'EUR/megawatt hour',
  // Note: This is a backend bug which needs hotfixing, this can be removed when the "Average passengers per bus" unit is fixed.
  'pkm/vkm': 'passenger/vehicle',
  mpkm: 'million passenger-kilometers',
  'Mpkm/year': 'million passenger-km/year',
  'kilowatt hour/kilowatt/year': 'kilowatt hours/year',
};
