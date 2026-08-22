import React from "react";
import RelatedCalculatorCard from "../../components/RelatedCalculatorCard";

export default function HowToCalculateCompoundInterest() {
  return (
    <div className="prose prose-slate prose-lg max-w-none">
      <p className="lead text-xl text-slate-600 mb-8 font-medium">
        Compound interest is often called the "eighth wonder of the world," and for good reason. Understanding how it works is the first step to building long-term wealth or managing your debt effectively.
      </p>

      <h2 id="what-is-compound-interest">What is Compound Interest?</h2>
      <p>
        In simple terms, compound interest is the interest you earn on both your original money (the principal) <strong>and</strong> on the interest you keep accumulating. It's essentially "interest on interest." Over long periods of time, this compounding effect can turn modest regular savings into a massive sum.
      </p>
      
      <p>
        Compare this to <em>simple interest</em>, where you only earn interest on the initial amount you invested. Compounding creates an exponential curve—the longer your money sits, the faster it grows.
      </p>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 my-8">
        <h3 className="text-amber-900 mt-0 mb-2">The Compound Interest Formula</h3>
        <p className="font-mono text-amber-800 bg-amber-100/50 p-4 rounded-xl text-center font-bold">
          A = P (1 + r/n)^(nt)
        </p>
        <ul className="text-sm text-amber-900/80 mb-0">
          <li><strong>A</strong> = the future value of the investment/loan</li>
          <li><strong>P</strong> = the principal investment amount</li>
          <li><strong>r</strong> = the annual interest rate (decimal)</li>
          <li><strong>n</strong> = the number of times that interest is compounded per year</li>
          <li><strong>t</strong> = the number of years the money is invested</li>
        </ul>
      </div>

      <h2 id="how-compounding-accelerates-your-wealth">How Compounding Accelerates Your Wealth</h2>
      <p>
        Let’s look at a practical example. Imagine you invest <strong>$10,000</strong> at an annual return of <strong>7%</strong>, compounded annually.
      </p>
      <ul>
        <li><strong>After 10 years:</strong> Your money grows to $19,671.</li>
        <li><strong>After 20 years:</strong> Your money grows to $38,696.</li>
        <li><strong>After 30 years:</strong> Your money grows to $76,122!</li>
      </ul>
      <p>
        Without adding a single extra penny, your money multiplied more than seven times over 30 years simply by reinvesting the interest.
      </p>

      <RelatedCalculatorCard 
        calculatorSlug="investment-calculator" 
        customTitle="Calculate Your Investment Growth"
        customDescription="Use our free Investment Calculator to visualize the magic of compound interest. Easily project your future wealth with interactive charts."
      />

      <h2 id="the-power-of-regular-contributions">The Power of Regular Contributions</h2>
      <p>
        The real magic happens when you combine compound interest with regular monthly contributions (often called a Systematic Investment Plan or SIP). If you add just $200 a month to that initial $10,000, your 30-year total jumps to over $310,000!
      </p>
      
      <RelatedCalculatorCard 
        calculatorSlug="savings-calculator" 
        customTitle="Plan Your Monthly Savings"
        customDescription="See how quickly your savings grow when you add a little bit every month using our Savings Calculator."
      />

      <h2>Key Takeaways for Investors</h2>
      <ol>
        <li><strong>Start Early:</strong> Time is the most important variable in the compound interest formula. The earlier you start, the less you have to save overall.</li>
        <li><strong>Reinvest Your Earnings:</strong> Don't withdraw your interest or dividends if you want to experience the true compounding effect.</li>
        <li><strong>Check Compounding Frequency:</strong> Daily or monthly compounding grows your money faster than annual compounding. Keep an eye out for this when choosing savings accounts or taking out loans.</li>
      </ol>
    </div>
  );
}
