export const GRADING_SCALES = {
  "standard": {
    name: "Standard A–F",
    description: "Standard US percentage grading scale",
    grades: [
      { letter: "A+", min: 97, max: 100, gpa: 4.0 },
      { letter: "A", min: 93, max: 96.99, gpa: 4.0 },
      { letter: "A-", min: 90, max: 92.99, gpa: 3.7 },
      { letter: "B+", min: 87, max: 89.99, gpa: 3.3 },
      { letter: "B", min: 83, max: 86.99, gpa: 3.0 },
      { letter: "B-", min: 80, max: 82.99, gpa: 2.7 },
      { letter: "C+", min: 77, max: 79.99, gpa: 2.3 },
      { letter: "C", min: 73, max: 76.99, gpa: 2.0 },
      { letter: "C-", min: 70, max: 72.99, gpa: 1.7 },
      { letter: "D+", min: 67, max: 69.99, gpa: 1.3 },
      { letter: "D", min: 63, max: 66.99, gpa: 1.0 },
      { letter: "D-", min: 60, max: 62.99, gpa: 0.7 },
      { letter: "F", min: 0, max: 59.99, gpa: 0.0 }
    ]
  },
  "custom": {
    name: "Custom Scale",
    description: "Define your own grading boundaries",
    grades: []
  }
};

export const PASS_THRESHOLDS = [
  { value: 40, label: "40%" },
  { value: 50, label: "50%" },
  { value: 60, label: "60%" }
];
