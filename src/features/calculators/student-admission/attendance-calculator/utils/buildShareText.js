export function buildShareText(mode, state, result) {
  const url = "https://www.snapfreetools.com/attendance-calculator";
  let text = `Attendance Calculator Result\n\n`;

  if (mode === "current") {
    text += `Current Attendance: ${result.percentageFormatted}%\n`;
    text += `Classes Attended: ${result.attended}\n`;
    text += `Total Classes: ${result.total}\n`;
  } else if (mode === "reach") {
    text += `Current Attendance: ${result.current.percentageFormatted}%\n`;
    text += `Target Attendance: ${state.target}%\n`;
    if (result.required.required > 0) {
      text += `Classes Required to Reach Target: ${result.required.required} consecutive classes\n`;
    } else {
      text += `Target already reached!\n`;
    }
  } else if (mode === "safe") {
    text += `Current Attendance: ${result.current.percentageFormatted}%\n`;
    text += `Target Attendance: ${state.target}%\n`;
    if (result.safe.safeAbsences > 0) {
      text += `Safe Absences Allowed: ${result.safe.safeAbsences}\n`;
    } else {
      text += `No safe absences allowed. Must attend next classes to stay above target.\n`;
    }
  } else if (mode === "project") {
    text += `Current Attendance: ${result.current.percentageFormatted}%\n`;
    text += `Planned to Attend: ${state.futureAttend}\n`;
    text += `Planned to Miss: ${state.futureMiss}\n`;
    text += `Projected Attendance: ${result.projection.projectedPercentageFormatted}%\n`;
  }

  text += `\nCalculated with SnapFreeTools Attendance Calculator:\n${url}`;
  return text;
}
