import { Parser } from "json2csv";

export const CsvFormatter = {
  format: (data) => {
    const parser = new Parser();
    return parser.parse(data);
  },
  extension: "csv",
  contentType: "text/csv; charset=utf-8",
};
