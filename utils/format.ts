import moment from "moment";

export function fixDateFormat(date) {
  let fixed = moment(date).format("L").replace(/\./g, "/").replace(/-/g, "/");
  return fixed;
}
export function fixDateFormatSimple(date) {
  let fixed = date.replace(/\//g, ".").replace(/-/g, ".");
  return fixed;
}

export function truncate(str, n, useWordBoundary) {
  if (str?.length <= n) {
    return str;
  }
  const subString = str?.substr(0, n - 1); // the original check
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}
