import React from "react";
import AttendanceCalculatorFeature from "@/features/calculators/student-admission/attendance-calculator";
import { generatePageMetadata } from "@/seo/metadata";

export const metadata = generatePageMetadata("attendance-calculator");

const faqs = [
  {
    question: "How is attendance percentage calculated?",
    answer: "Attendance percentage is calculated by dividing the number of classes you have attended by the total number of classes held, then multiplying by 100. For example, if you attended 80 out of 100 classes, your attendance is (80 / 100) × 100 = 80%."
  },
  {
    question: "How many classes must I attend to reach 75% attendance?",
    answer: "The exact number depends on your current attendance and total classes. Use our 'Reach Target' mode to find the exact number of consecutive classes you must attend without missing any to hit your target percentage."
  },
  {
    question: "How many classes can I miss and stay above 75%?",
    answer: "This is called your 'Safe Absences' allowance. If your attendance is currently above 75%, our calculator can tell you exactly how many future classes you can safely skip without your attendance dropping below the required 75% threshold."
  },
  {
    question: "Can I calculate attendance using missed classes?",
    answer: "Yes. Our calculator allows you to input either the number of 'classes attended' or 'classes missed' alongside the total classes held. It will automatically calculate the other value for you."
  },
  {
    question: "What does safe absence mean?",
    answer: "A safe absence is a class you can miss without your overall attendance percentage dropping below your mandatory target (e.g., 75%). Missing more than your safe allowance will put your attendance at risk."
  },
  {
    question: "Why may my college attendance differ from this result?",
    answer: "Our calculator uses standard mathematical rounding. However, some universities have strict policies—such as not rounding up (treating 74.9% as failing) or weighing certain labs and lectures differently. Always verify with your institution's official portal."
  },
  {
    question: "Does approved leave count as attendance?",
    answer: "This depends entirely on your university's policy. Some institutions count medical or sports leave as 'attended', while others deduct it from the total classes held. Adjust your total classes or attended classes in the calculator according to your specific rules."
  },
  {
    question: "Can I use this calculator for each subject separately?",
    answer: "Absolutely. Attendance is usually tracked per subject. You can use this calculator for each individual course by entering the specific total and attended classes for that subject."
  },
  {
    question: "Is my attendance data saved or uploaded?",
    answer: "No. All calculations are performed instantly on your device in your web browser. We do not store, save, or upload any of your attendance data to our servers."
  }
];

export default function AttendanceCalculatorPage() {
  return (
    <AttendanceCalculatorFeature faqs={faqs} />
  );
}
