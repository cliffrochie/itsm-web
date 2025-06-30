export function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export function capitalizeFirstLetter(val: string) {
  return val
    .split(" ") // Split the sentence into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" ");
}

export function capitalizeFirstLetterKebab(val: string) {
  return val
    .split("-") // Split the sentence into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" ");
}

export function formatParagraph(val: string) {
  return val.replace(/(?:^|\.\s+)([a-z])/g, (match, char) =>
    match.replace(char, char.toUpperCase())
  );
}

export const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]$/;

export function getDateFormatYYYYMMDD() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().substring(2);
  const month =
    currentDate.getMonth() + 1 < 10
      ? `0${currentDate.getMonth() + 1}`
      : (currentDate.getMonth() + 1).toString();
  const date =
    currentDate.getDate() < 10
      ? `0${currentDate.getDate()}`
      : currentDate.getDate().toString();
  return year + "-" + month + "-" + date;
}

export function changeDateFormatMMDDYYYY(date: Date) {
  const year = date.getFullYear().toString();
  const month =
    date.getMonth() < 10
      ? `0${date.getMonth() + 1}`
      : (date.getMonth() + 1).toString();
  const day =
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();
  return month + "/" + day + "/" + year;
}

export function generateTicket() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().substring(2);
  const month =
    currentDate.getMonth() + 1 < 10
      ? `0${currentDate.getMonth() + 1}`
      : (currentDate.getMonth() + 1).toString();
  const date =
    currentDate.getDate() < 10
      ? `0${currentDate.getDate()}`
      : currentDate.getDate().toString();
  const ticket = year + month + date + generateShortUUID(4).toUpperCase();
  return ticket;
}

function generateShortUUID(length: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => b.toString(36).padStart(2, "0")) // Convert to base36 and pad
    .join("")
    .substring(0, length);
}

export function formatDate(date: Date) {
  const result = new Date(date);
  const formattedDate = result.toLocaleDateString("en-US", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Set to false for 24-hour format
  });
  return formattedDate;
}
