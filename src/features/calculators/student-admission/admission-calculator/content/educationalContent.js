export default function EducationalContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 prose prose-slate">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Understanding Admission Calculators and Merit Aggregates</h2>
      
      <div className="space-y-12">
        <section>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">What is an Admission Calculator?</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            An <strong>Admission Calculator</strong> is a tool designed to help students estimate their university merit percentage by combining their past academic scores with their entry test results using a specific formula. It provides a quick and accurate way to determine your final aggregate before applying to colleges.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">What is an Admission Aggregate?</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            An <strong>Admission Aggregate</strong> is a weighted percentage that universities use to rank applicants. Instead of relying solely on your matriculation (SSC) or intermediate (HSSC) marks, universities assign different weightages to each academic level, usually giving the highest importance to their specific entry test.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">How Admission Aggregate is Calculated</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Calculating your merit aggregate requires knowing the weightage formula of your target university. The general formula is:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6 shadow-sm">
            <code className="text-sm font-semibold text-indigo-600 block mb-2">Final Aggregate =</code>
            <code className="text-sm font-medium text-slate-700 block mb-1">(SSC Percentage × SSC Weight)</code>
            <code className="text-sm font-semibold text-slate-400 block mb-1">+</code>
            <code className="text-sm font-medium text-slate-700 block mb-1">(HSSC Percentage × HSSC Weight)</code>
            <code className="text-sm font-semibold text-slate-400 block mb-1">+</code>
            <code className="text-sm font-medium text-slate-700 block">(Entry Test Percentage × Entry Test Weight)</code>
          </div>
          <p className="text-slate-600 mb-4 leading-relaxed">
            <strong>Example Calculation:</strong> If you scored 82% in Matric (20% weight), 88% in Inter (30% weight), and 76% in your Entry Test (50% weight):
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
            <li>SSC Contribution: 82 × 0.20 = <strong>16.40</strong></li>
            <li>HSSC Contribution: 88 × 0.30 = <strong>26.40</strong></li>
            <li>Entry Test Contribution: 76 × 0.50 = <strong>38.00</strong></li>
            <li><strong>Final Aggregate: 80.80%</strong></li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">How to Calculate Required Entry Test Marks</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            If you know your academic scores and your target final aggregate, you can mathematically reverse-engineer the required entry test marks. The formula is:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6 shadow-sm">
            <code className="text-sm font-semibold text-indigo-600 block mb-2">Required Entry Test Percentage =</code>
            <code className="text-sm font-medium text-slate-700 block mb-1">(Target Aggregate - Academic Contribution) / Entry Test Weight</code>
          </div>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Our <strong>Target Aggregate Planner</strong> does this automatically for you. It will instantly tell you exactly how many marks you need to secure out of the total entry test marks to achieve your dream aggregate.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Important Disclaimer About University Admission</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Admission requirements and merit formulas vary significantly by university, program, and admission cycle. An aggregate score calculated here does <strong>not</strong> guarantee admission. Actual merit depends on the university's official policies, the total number of applicants, and available seats. Always verify the official criteria directly with the university before applying.
          </p>
        </section>
      </div>
    </div>
  );
}
