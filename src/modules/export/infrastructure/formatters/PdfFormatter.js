import PDFDocument from "pdfkit";

export const PdfFormatter = {
  format: async (data) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    return await new Promise((resolve, reject) => {
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(18).text("Relatório", { align: "center" });
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
    });
  },
  extension: "pdf",
  contentType: "application/pdf",
};
