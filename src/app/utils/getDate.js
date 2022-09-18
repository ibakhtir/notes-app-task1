export function getDate(ms, condition) {
  const date = new Date(ms);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: condition === "full" ? "long" : "numeric",
    day: "numeric",
  });
}

export function getDateFromText(str) {
  const regExp = /\d{1,2}\D\d{1,2}\D(\d{2,4}|\d{4})/g;

  return str.match(regExp);
}
