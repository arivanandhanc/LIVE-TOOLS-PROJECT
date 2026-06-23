import type { GenSpec } from "./types";

const lin = (factors: Record<string, number>) => (v: number, a: string, b: string) => (v * factors[a]) / factors[b];

const C = (slug: string, name: string, description: string, keywords: string[], factors: Record<string, number>, from: string, to: string): GenSpec =>
  ({ slug, name, description, keywords, category: "convert", kind: "convert", units: Object.keys(factors), convert: lin(factors), convFrom: from, convTo: to });

// fuel economy via common base km/L
const toKmL = (v: number, u: string) => u === "MPG (US)" ? v * 0.4251437 : u === "MPG (UK)" ? v * 0.3540060 : u === "L/100km" ? 100 / v : v;
const fromKmL = (k: number, u: string) => u === "MPG (US)" ? k / 0.4251437 : u === "MPG (UK)" ? k / 0.3540060 : u === "L/100km" ? 100 / k : k;

export const convertTools: GenSpec[] = [
  C("frequency-converter", "Frequency Converter", "Convert Hz, kHz, MHz, GHz and RPM.", ["frequency", "hertz"], { Hertz: 1, Kilohertz: 1e3, Megahertz: 1e6, Gigahertz: 1e9, Terahertz: 1e12, RPM: 1 / 60 }, "Megahertz", "Hertz"),
  C("power-converter", "Power Converter", "Convert watts, kilowatts, horsepower and BTU/h.", ["power", "watts", "horsepower"], { Watts: 1, Kilowatts: 1e3, Megawatts: 1e6, Horsepower: 745.699872, "BTU/hour": 0.29307107 }, "Horsepower", "Kilowatts"),
  C("force-converter", "Force Converter", "Convert newtons, pound-force, kgf and dynes.", ["force", "newton"], { Newtons: 1, Kilonewtons: 1e3, "Pound-force": 4.4482216153, "Kilogram-force": 9.80665, Dynes: 1e-5 }, "Newtons", "Pound-force"),
  C("torque-converter", "Torque Converter", "Convert newton-meters, pound-feet and kgf·m.", ["torque", "newton-meter"], { "Newton-meters": 1, "Pound-feet": 1.3558179483, "Kilogram-force meters": 9.80665, "Newton-centimeters": 0.01 }, "Newton-meters", "Pound-feet"),
  C("data-transfer-rate", "Data Transfer Rate", "Convert bps, Mbps, Gbps and MB/s.", ["bandwidth", "bitrate", "mbps"], { "Bits/sec": 1, "Kilobits/sec": 1e3, "Megabits/sec": 1e6, "Gigabits/sec": 1e9, "Bytes/sec": 8, "Kilobytes/sec": 8e3, "Megabytes/sec": 8e6 }, "Megabits/sec", "Megabytes/sec"),
  C("illuminance-converter", "Illuminance Converter", "Convert lux, foot-candles and phot.", ["illuminance", "lux"], { Lux: 1, "Foot-candles": 10.7639104, Phot: 10000 }, "Lux", "Foot-candles"),
  C("acceleration-converter", "Acceleration Converter", "Convert m/s², g-force and ft/s².", ["acceleration", "gravity"], { "Meters/sec²": 1, "G-force": 9.80665, "Feet/sec²": 0.3048, Gal: 0.01 }, "Meters/sec²", "G-force"),
  C("flow-rate-converter", "Flow Rate Converter", "Convert L/s, L/min, m³/h and gal/min.", ["flow", "rate"], { "Liters/sec": 1, "Liters/min": 1 / 60, "Cubic meters/hour": 1000 / 3600, "Gallons/min (US)": 0.0630901964, "Cubic feet/min": 0.471947443 }, "Liters/min", "Gallons/min (US)"),
  C("astronomical-distance", "Astronomical Distance", "Convert km, AU, light-years and parsecs.", ["astronomy", "light year", "parsec"], { Kilometers: 1, "Astronomical units": 149597870.7, "Light years": 9.4607304725808e12, Parsecs: 3.0856775814913673e13, Miles: 1.609344 }, "Light years", "Kilometers"),
  C("electric-charge", "Electric Charge Converter", "Convert coulombs, mAh and Ah.", ["charge", "coulomb", "mah"], { Coulombs: 1, Millicoulombs: 1e-3, Microcoulombs: 1e-6, "Ampere-hours": 3600, "Milliampere-hours": 3.6 }, "Milliampere-hours", "Coulombs"),
  C("voltage-converter", "Voltage Converter", "Convert volts, millivolts and kilovolts.", ["voltage", "volts"], { Volts: 1, Millivolts: 1e-3, Kilovolts: 1e3, Microvolts: 1e-6 }, "Volts", "Millivolts"),
  C("current-converter", "Electric Current Converter", "Convert amperes, milliamperes and kiloamperes.", ["current", "amps"], { Amperes: 1, Milliamperes: 1e-3, Kiloamperes: 1e3, Microamperes: 1e-6 }, "Amperes", "Milliamperes"),
  C("resistance-converter", "Resistance Converter", "Convert ohms, kilohms and megohms.", ["resistance", "ohms"], { Ohms: 1, Kiloohms: 1e3, Megaohms: 1e6, Milliohms: 1e-3 }, "Kiloohms", "Ohms"),
  C("capacitance-converter", "Capacitance Converter", "Convert farads, µF, nF and pF.", ["capacitance", "farad"], { Farads: 1, Millifarads: 1e-3, Microfarads: 1e-6, Nanofarads: 1e-9, Picofarads: 1e-12 }, "Microfarads", "Nanofarads"),
  C("inductance-converter", "Inductance Converter", "Convert henries, mH and µH.", ["inductance", "henry"], { Henries: 1, Millihenries: 1e-3, Microhenries: 1e-6 }, "Millihenries", "Microhenries"),
  C("blood-sugar-converter", "Blood Sugar Converter", "Convert glucose between mg/dL and mmol/L.", ["glucose", "blood sugar", "diabetes"], { "mg/dL": 1, "mmol/L": 18.0182 }, "mg/dL", "mmol/L"),
  {
    slug: "fuel-economy-converter", name: "Fuel Economy Converter",
    description: "Convert MPG, km/L and L/100km.", keywords: ["fuel", "mpg", "economy"],
    category: "convert", kind: "convert",
    units: ["MPG (US)", "MPG (UK)", "km/L", "L/100km"],
    convert: (v, from, to) => fromKmL(toKmL(v, from), to),
    convFrom: "MPG (US)", convTo: "L/100km", convValue: "30",
  },
];
