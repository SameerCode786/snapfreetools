import React from "react";

export const EDUCATIONAL_CONTENT = () => {
  return (
    <div className="space-y-8">
      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-4">
          Understanding Loan Calculations & Amortization
        </h2>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>
            An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term.
          </p>
          <p>
            When you first start making payments on a standard amortizing loan (like a mortgage or auto loan), the majority of your payment goes toward interest. As the principal balance decreases over time, less interest accrues, meaning a larger portion of your fixed monthly payment goes toward the principal.
          </p>
          <h3 className="text-lg font-bold text-slate-800 pt-2">How Extra Payments Save Interest</h3>
          <p>
            Because interest is calculated on the remaining principal balance, any extra payment you make goes directly toward reducing that principal. A smaller principal balance generates less interest in the following month. By consistently paying extra, you accelerate the amortization process, significantly reducing the total interest paid and the time it takes to become debt-free.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-4">
          Debt-to-Income Ratio (DTI) Explained
        </h2>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>
            Your Debt-to-Income (DTI) ratio is a personal finance measure that compares your monthly debt payment to your monthly gross income. It is one of the most important metrics lenders use to measure your ability to manage the monthly payments to repay the money you plan to borrow.
          </p>
          <h3 className="text-lg font-bold text-slate-800 pt-2">How to calculate DTI</h3>
          <p>
            Divide your total recurring monthly debt by your gross monthly income, and express it as a percentage. For example, if your monthly debt equals $2,000 and your gross monthly income is $6,000, your DTI is 33%.
          </p>
          <p>
            Lenders generally prefer a DTI lower than 43%, though some mortgage programs allow higher ratios. A lower DTI shows that you have a good balance between debt and income.
          </p>
        </div>
      </section>
    </div>
  );
};

