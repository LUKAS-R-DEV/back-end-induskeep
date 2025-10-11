// src/modules/reports/infrastructure/PdfAdapter.js
import fs from "fs";
import PDFDocument from "pdfkit";

export const PdfAdapter = {
  async generate(data, name = "report") {
    const filename = `src/modules/reports/infrastructure/storage/${name}_${Date.now()}.pdf`;
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filename);
    doc.pipe(stream);

    doc.fontSize(18).text(`Relatório: ${name.toUpperCase()}`, { align: "center" });
    doc.moveDown();

    if (Array.isArray(data)) {
      data.forEach((item, i) => {
        doc.fontSize(12).text(`${i + 1}. ${JSON.stringify(item, null, 2)}`);
        doc.moveDown();
      });
    } else {
      doc.fontSize(12).text(JSON.stringify(data, null, 2));
    }

    doc.end();

    await new Promise(resolve => stream.on("finish", resolve));
    return filename;
  },
};
