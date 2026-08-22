import React from "react";
import { Icons } from "@/lib/lucide-icons";
import { safeFormatNumber } from "../utils/calculations";

export default function FinancialInsights({ result, mode, currencySymbol }) {
  if (!result || result.isEmpty || !result.isValid) return null;

  const getInsights = () => {
    const insights = [];
    
    if (mode === 'growth' || mode === 'compound') {
      const interestRatio = result.totalContributions > 0 ? (result.totalInterest / result.futureValue) * 100 : 0;
      
      if (interestRatio > 50) {
        insights.push({
          icon: "TrendingUp",
          color: "text-emerald-500",
          bgColor: "bg-emerald-50",
          title: "Powerful Compounding",
          text: `More than half (${safeFormatNumber(interestRatio, 0)}%) of your final balance comes entirely from interest. This is the power of compounding over long periods.`
        });
      } else if (interestRatio > 20) {
        insights.push({
          icon: "TrendingUp",
          color: "text-emerald-500",
          bgColor: "bg-emerald-50",
          title: "Healthy Growth",
          text: `Interest contributes a healthy ${safeFormatNumber(interestRatio, 0)}% to your total savings. Consider increasing your time horizon or monthly contributions to compound even faster.`
        });
      } else if (result.futureValue > 0) {
        insights.push({
          icon: "PiggyBank",
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          title: "Savings Driven",
          text: `Most of your future balance comes directly from your contributions. To increase the impact of compound interest, consider finding a higher yield account or saving for longer.`
        });
      }

      if (result.totalInterest === 0 && result.totalContributions > 0) {
        insights.push({
          icon: "AlertCircle",
          color: "text-amber-500",
          bgColor: "bg-amber-50",
          title: "Zero Interest Rate",
          text: "Your current interest rate is 0%. Without a yield, your money loses purchasing power over time due to inflation. Look into high-yield savings accounts or investments."
        });
      }
    }

    if (mode === 'goal') {
      if (result.isReached) {
        insights.push({
          icon: "CheckCircle",
          color: "text-emerald-500",
          bgColor: "bg-emerald-50",
          title: "Goal Achieved",
          text: "Congratulations! You have already reached or exceeded your target savings goal."
        });
      } else {
        insights.push({
          icon: "Target",
          color: "text-indigo-500",
          bgColor: "bg-indigo-50",
          title: "Goal Timeline",
          text: `It will take roughly ${result.years} years to reach your goal. If you increase your monthly contribution slightly, you could reach this significantly faster.`
        });
      }
    }

    if (mode === 'required') {
      insights.push({
        icon: "Calendar",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        title: "Required Commitment",
        text: `You need to save ${currencySymbol}${safeFormatNumber(result.requiredMonthly, 0)} strictly every month to hit your target in exactly ${safeFormatNumber(result.totalMonths, 0)} months.`
      });
    }

    if (mode === 'emergency') {
      if (result.remaining > 0) {
        insights.push({
          icon: "ShieldAlert",
          color: "text-amber-500",
          bgColor: "bg-amber-50",
          title: "Funding Gap",
          text: `You have a shortfall of ${currencySymbol}${safeFormatNumber(result.remaining, 0)}. Try to set aside a fixed percentage of your monthly income until you close this gap.`
        });
      } else {
        insights.push({
          icon: "ShieldCheck",
          color: "text-emerald-500",
          bgColor: "bg-emerald-50",
          title: "Fully Funded",
          text: "Your emergency fund is fully funded for your selected target! Consider redirecting future savings towards long-term investments."
        });
      }
    }

    return insights;
  };

  const insights = getInsights();
  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Key Insights</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => {
          const Icon = Icons[insight.icon];
          return (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`w-12 h-12 rounded-full ${insight.bgColor} flex items-center justify-center shrink-0`}>
                <Icon size={24} className={insight.color} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">{insight.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
