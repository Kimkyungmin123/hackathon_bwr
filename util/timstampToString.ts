export const formatTimestamptoString = (
  nanoseconds: number,
  seconds: number
): string => {
  const milliseconds = Math.floor(nanoseconds / 1e6);
  const totalMilliseconds = seconds * 1000 + milliseconds;
  const timestamp = new Date(totalMilliseconds);

  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, "0");
  const day = String(timestamp.getDate()).padStart(2, "0");
  const hours = String(timestamp.getHours()).padStart(2, "0");
  const minutes = String(timestamp.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
