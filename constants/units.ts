export const DECIMAL_PRECISION_BY_UNIT = {
  capita: 0,
  'percent/year': 1,
  'kilometer²': 0,
  'Mpkm/year': 0,
  'passenger/vehicle': 1,
  'gram/vkm': 2,
  vehicle: 0,
  '%': 1,
  'Mkm·metric ton/year': 0,
  thousand_square_meters: 0,
  'kilowatt hour/meter²/year': 0,
  'gigawatt_hour/year': 0,
  'gigawatt hours/year': 0,
  'gram/kilowatt hour': 2,
  'EUR/megawatt_hour': 0,
  'kilowatt hour/kilowatt/year': 0,
  'metric ton/year': 0,
  'kilogram/metric ton': 2,
  'EUR/kilowatt hour': 2,
  'kt/year': 2,
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
};
