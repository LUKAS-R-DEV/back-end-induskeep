// src/modules/reports/infrastructure/CsvAdapter.js
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

export const CsvAdapter = {
  async generate(data, name = "report") {
    const filename = `src/modules/reports/infrastructure/storage/${name}_${Date.now()}.csv`;

    const records = Array.isArray(data) ? data : [data];
    const headers = Object.keys(records[0] || {}).map(k => ({ id: k, title: k }));

    const csvWriter = createObjectCsvWriter({ path: filename, header: headers });
    await csvWriter.writeRecords(records);

    return filename;
  },
};
