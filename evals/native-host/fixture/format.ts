function format(a: number, b: number): string {
 return `Retry ${b} after ${a} ms`;
}
export function retryMessage(delayMs: number, retryCount: number): string {
 return format(delayMs, retryCount);
}
