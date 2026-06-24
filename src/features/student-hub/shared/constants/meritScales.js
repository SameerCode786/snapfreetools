export const MERIT_SCALES = {
  "nust": {
    name: "NUST Merit Calculator",
    university: "National University of Sciences and Technology (NUST)",
    description: "NET engineering / computing aggregate (75% NET, 15% HSSC/FSc, 10% SSC/Matric)",
    fields: [
      { id: "matric", label: "Matric / O-Level (%)", weight: 0.10, min: 0, max: 100, placeholder: "e.g. 85" },
      { id: "fsc", label: "FSc / A-Level (%)", weight: 0.15, min: 0, max: 100, placeholder: "e.g. 80" },
      { id: "test", label: "NUST Entry Test (NET) Score (out of 200)", weight: 0.75, min: 0, max: 200, isScore: true, outOf: 200, placeholder: "e.g. 145" }
    ]
  },
  "fast": {
    name: "FAST Merit Calculator",
    university: "FAST National University of Computer and Emerging Sciences",
    description: "FAST aggregate calculation (50% Entry Test, 40% FSc/A-Level, 10% Matric/O-Level)",
    fields: [
      { id: "matric", label: "Matric / O-Level (%)", weight: 0.10, min: 0, max: 100, placeholder: "e.g. 85" },
      { id: "fsc", label: "FSc / A-Level (%)", weight: 0.40, min: 0, max: 100, placeholder: "e.g. 80" },
      { id: "test", label: "FAST Entry Test Score (%)", weight: 0.50, min: 0, max: 100, placeholder: "e.g. 70" }
    ]
  },
  "comsats": {
    name: "COMSATS Merit Calculator",
    university: "COMSATS University Islamabad",
    description: "COMSATS admissions aggregate (50% NTS Nat, 40% FSc/HSSC, 10% Matric/SSC)",
    fields: [
      { id: "matric", label: "Matric / O-Level (%)", weight: 0.10, min: 0, max: 100, placeholder: "e.g. 85" },
      { id: "fsc", label: "FSc / A-Level (%)", weight: 0.40, min: 0, max: 100, placeholder: "e.g. 80" },
      { id: "test", label: "NTS NTS-NAT Score (out of 100)", weight: 0.50, min: 0, max: 100, isScore: true, outOf: 100, placeholder: "e.g. 78" }
    ]
  },
  "uet": {
    name: "UET Merit Calculator",
    university: "University of Engineering and Technology (UET)",
    description: "UET admission aggregate (33% ECAT Test, 50% FSc/A-Level, 17% Matric)",
    fields: [
      { id: "matric", label: "Matric / O-Level (%)", weight: 0.17, min: 0, max: 100, placeholder: "e.g. 85" },
      { id: "fsc", label: "FSc / A-Level (%)", weight: 0.50, min: 0, max: 100, placeholder: "e.g. 80" },
      { id: "test", label: "ECAT Entry Test Score (out of 400)", weight: 0.33, min: 0, max: 400, isScore: true, outOf: 400, placeholder: "e.g. 210" }
    ]
  }
};
export const DEFAULT_MERIT_FIELDS = [
  { id: "matric", label: "Matric / O-Level (%)", weight: 0.20, min: 0, max: 100, placeholder: "e.g. 85" },
  { id: "fsc", label: "FSc / A-Level (%)", weight: 0.30, min: 0, max: 100, placeholder: "e.g. 80" },
  { id: "test", label: "Entry Test Marks (%)", weight: 0.50, min: 0, max: 100, placeholder: "e.g. 75" }
];
