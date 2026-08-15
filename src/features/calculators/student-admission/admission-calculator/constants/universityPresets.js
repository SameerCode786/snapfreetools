export const UNIVERSITY_PRESETS = [
  {
    id: "generic",
    name: "Generic Weighted Aggregate",
    description: "A standard configurable formula for calculating admission aggregates.",
    weights: {
      ssc: 20,
      hssc: 30,
      entryTest: 50
    },
    isConfigurable: true
  }
  // Architecture prepared for future additions:
  // {
  //   id: "university-a",
  //   name: "University A Formula",
  //   description: "Official formula for University A.",
  //   weights: { ssc: 10, hssc: 40, entryTest: 50 },
  //   isConfigurable: false
  // }
];
