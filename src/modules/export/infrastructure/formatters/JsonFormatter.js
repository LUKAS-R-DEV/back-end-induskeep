export const JsonFormatter = {
  format: (data) => JSON.stringify(data, null, 2),
  extension: "json",
  contentType: "application/json; charset=utf-8",
};
