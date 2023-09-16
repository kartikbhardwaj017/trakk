const monthNames = {
    JAN: { number: "01", days: 31 },
    FEB: { number: "02", days: 28 },
    MAR: { number: "03", days: 31 },
    APR: { number: "04", days: 30 },
    MAY: { number: "05", days: 31 },
    JUN: { number: "06", days: 30 },
    JUL: { number: "07", days: 31 },
    AUG: { number: "08", days: 31 },
    SEP: { number: "09", days: 30 },
    OCT: { number: "10", days: 31 },
    NOV: { number: "11", days: 30 },
    DEC: { number: "12", days: 31 },
  };

export function getDateRange (date: string, view: string): string[] {
    let date1 = "";
    let date2 = "";
    if (view === "daily") {
        date1 = date;
        date2 = date;
      }
      if (view === "weekly") {
        const [year, month, weekno] = date?.split("-");
        const day1 = (Number(weekno.charAt(weekno.length - 1)) - 1) * 7 + 1;
        const day1num = day1 < 10 ? `0${day1}` : `${day1}`;
        const monthName = monthNames[month].number;
        date1 = `${day1num}/${monthName}/${year}`;
        const day2 = Number(weekno.charAt(weekno.length - 1)) * 7;
        const day2num = day2 < 10 ? `0${day2}` : `${day2}`;
        date2 = `${day2num}/${monthName}/${year}`;
      }
      if (view === "monthly") {
        const [year, month] = date?.split(" ");
        // console.log("y", year, month);
        const monthName = monthNames[month].number;
        const day2 = monthNames[month].days;
        date1 = `01/${monthName}/${year}`;
        date2 = `${day2}/${monthName}/${year}`;
      }

      if (view === "yearly") {
        const year = date;
        date1 = `01/01/${year}`;
        date2 = `31/12/${year}`;
      }
    return [date1, date2]
}