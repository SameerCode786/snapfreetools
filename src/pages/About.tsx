import { motion } from "motion/react";
import { Heart, Users, Globe, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div id="about-page" className="max-w-4xl mx-auto px-4 py-16">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 text-center"
      >
        <h1 className="text-4xl font-bold mb-6">About SnapFreeTools</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          We believe high-quality productivity tools should be accessible to everyone, 
          without the burden of subscriptions, ads, or privacy concerns.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="text-red-500" />
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed">
            SnapFreeTools was started with a simple goal: to create a "Swiss Army Knife" for the web. 
            We saw too many tools cluttered with ads or hidden behind paywalls for simple tasks like 
            counting words or compressing an image. We wanted to build something better.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="text-blue-500" />
            Built for You
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Whether you're a student calculating your GPA, a writer hitting a word limit, or a 
            developer optimizing assets, we build our tools based on your feedback and needs.
          </p>
        </div>
      </div>

      <section className="bg-white rounded-3xl p-10 border border-slate-200">
        <h3 className="text-2xl font-bold mb-8 text-center">Core Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Privacy First", text: "Tools run in-browser. Your data never touches our servers." },
            { title: "Zero Cost", text: "No trials, no limits. Free forever for everyone." },
            { title: "Clean Design", text: "Minimal UI focusing on getting the job done." }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <CheckCircle2 className="text-emerald-500 mx-auto mb-3" size={32} />
              <h4 className="font-bold mb-2">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
