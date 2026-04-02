// Get the next Saturday date (or today if Saturday) in Pacific time
export function getNextSaturday(): string {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const day = now.getDay();
  const daysUntilSaturday = day === 6 ? 0 : (6 - day);
  const saturday = new Date(now);
  saturday.setDate(saturday.getDate() + daysUntilSaturday);
  return saturday.toISOString().split("T")[0]; // YYYY-MM-DD
}
