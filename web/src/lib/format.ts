export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberWithComma(num: string | number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
