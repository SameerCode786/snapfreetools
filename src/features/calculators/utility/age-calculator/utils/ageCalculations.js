/**
 * Calculates exact age between two dates.
 * @param {string|Date} dobDate - Date of Birth (YYYY-MM-DD or Date object)
 * @param {string|Date} targetDate - Target Date to calculate age at (YYYY-MM-DD or Date object)
 * @returns {Object} Age details or error
 */
export function calculateAge(dobDate, targetDate) {
  try {
    const start = new Date(dobDate);
    const end = new Date(targetDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { isValid: false, isEmpty: false, error: "Invalid date format." };
    }

    if (start > end) {
      return { isValid: false, isEmpty: false, error: "Date of Birth cannot be after the Target Date." };
    }

    // Ensure we ignore time components for exact day calculation
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDaysTotal = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculate Exact Years, Months, Days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      months--;
      // Get the number of days in the previous month of the target year
      const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += previousMonth.getDate();
    }

    if (months < 0) {
      months = 11;
    }

    // Totals
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(diffDaysTotal / 7);
    const totalDays = diffDaysTotal;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next Birthday calculation
    const currentYearBirthday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    let nextBirthday = currentYearBirthday;

    if (end > currentYearBirthday) {
      nextBirthday = new Date(end.getFullYear() + 1, start.getMonth(), start.getDate());
    }
    
    const timeUntilNextBday = nextBirthday.getTime() - end.getTime();
    const daysUntilNextBday = Math.floor(timeUntilNextBday / (1000 * 60 * 60 * 24));

    // Day of week
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[start.getDay()];

    return {
      isValid: true,
      isEmpty: false,
      error: null,
      exact: { years, months, days },
      total: { 
        years, 
        months: totalMonths, 
        weeks: totalWeeks, 
        days: totalDays, 
        hours: totalHours, 
        minutes: totalMinutes 
      },
      nextBirthday: {
        date: nextBirthday,
        daysRemaining: daysUntilNextBday,
        nextAge: years + 1
      },
      bornOn: dayOfWeek
    };

  } catch (error) {
    return { isValid: false, isEmpty: false, error: "An error occurred during calculation." };
  }
}
