export function formateDate(timestamp: number) {
  return new Date(timestamp * 1000).toDateString();
}
