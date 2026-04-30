export const getLogType = (log: any) => {
  const str = JSON.stringify(log || {}).toLowerCase();

  const level = String(log?.level || "").toLowerCase();
  const type = String(log?.type || "").toLowerCase();

  if (
    level === "error" ||
    type === "error" ||
    (typeof log?.status === "number" && log.status >= 400) ||
    str.includes("error") ||
    str.includes("fail") ||
    str.includes("exception")
  ) {
    return "error";
  }

  if (
    level === "warn" ||
    level === "warning" ||
    type === "warn" ||
    type === "warning" ||
    str.includes("warn")
  ) {
    return "warn";
  }

  return "normal";
};