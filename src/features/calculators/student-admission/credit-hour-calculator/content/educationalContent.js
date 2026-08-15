export default function EducationalContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 prose prose-slate">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Understanding Credit Hours</h2>
      
      <p className="text-slate-600 mb-8 text-lg">
        Whether you are planning your upcoming semester or mapping out your entire path to graduation, understanding how credit hours work is essential for academic success. 
      </p>

      <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4">What Is a Credit Hour?</h3>
      <p className="text-slate-600 mb-6">
        A <strong>credit hour</strong> is the standard unit of measurement used by educational institutions to represent the amount of academic work a student completes. Generally, one credit hour represents one hour of classroom instruction and approximately two hours of outside study per week over the course of a standard semester (usually 15-16 weeks).
      </p>

      <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4">How to Calculate Credit Hours</h3>
      <p className="text-slate-600 mb-4">
        Calculating your total credit hours is straightforward: simply add up the individual credit values of all the courses you have successfully completed.
      </p>
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6 font-mono text-sm">
        <strong>Formula:</strong> Total Credit Hours = Course 1 Credits + Course 2 Credits + Course 3 Credits...
      </div>
      <p className="text-slate-600 mb-6">
        For example, if you complete three courses worth 3 credits each and one course worth 4 credits, your total for that semester would be 13 credit hours.
      </p>

      <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4">How Many Credit Hours Is Full-Time?</h3>
      <p className="text-slate-600 mb-6">
        While definitions can vary by institution and country, a standard full-time undergraduate workload in the United States is typically <strong>12 or more credit hours per semester</strong>. Taking fewer than 12 credits usually classifies a student as part-time, which can affect financial aid, housing eligibility, and visa status.
      </p>
      <p className="text-slate-600 mb-6">
        However, it's important to note that taking only 12 credits per semester (24 per year) will typically result in needing 5 years to complete a 120-credit degree. To graduate in four years without taking summer courses, you generally need to average <strong>15 credits per semester</strong>.
      </p>

      <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4">How Many Credit Hours Are Needed for a Bachelor's Degree?</h3>
      <p className="text-slate-600 mb-6">
        Most bachelor's degree programs in the United States require approximately <strong>120 credit hours</strong> for completion. This is usually divided into about 40 courses worth 3 credits each. Associate degrees typically require around 60 credit hours, while master's programs vary widely but often require between 30 and 60 credits beyond a bachelor's degree.
      </p>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 mt-4">
        <h4 className="text-lg font-bold text-blue-900 mb-2">Note on University Variations</h4>
        <p className="text-blue-800 text-sm m-0">
          Credit-hour policies and graduation requirements can vary significantly by institution, academic program, and country. Always consult your university's official academic catalog or your academic advisor for definitive requirements regarding your specific situation.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4">Credit Hours vs Contact Hours</h3>
      <p className="text-slate-600 mb-6">
        <strong>Contact hours</strong> refer to the actual time you spend in a classroom or lab directly interacting with an instructor. <strong>Credit hours</strong> represent the overall value of the course towards your degree. A course might have 4 contact hours (e.g., 3 hours of lecture and 1 hour of lab) but only be worth 3 credit hours, depending on the institution's curriculum structure.
      </p>

      <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4">How Credit Hours Affect GPA</h3>
      <p className="text-slate-600 mb-6">
        Credit hours act as the "weight" in your Grade Point Average (GPA) calculation. A 4-credit course has a larger impact on your overall GPA than a 3-credit course. To calculate your GPA, you multiply the numeric value of your grade (e.g., an A = 4.0) by the number of credit hours for that course, sum those up for all courses, and divide by the total number of credit hours attempted.
      </p>
    </div>
  );
}
