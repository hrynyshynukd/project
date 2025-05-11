function transformLogs(logs, locale = "uk-UA") {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  return logs.map((log) => {
    return {
      id: log.id,
      date: Intl.DateTimeFormat(locale, options).format(log.date),
      deviceId: log.deviceId,
      category: log.category,
      description: log.description,
      createdAt: Intl.DateTimeFormat(locale, options).format(log.createdAt),
    };
  });
}

module.exports = transformLogs;
