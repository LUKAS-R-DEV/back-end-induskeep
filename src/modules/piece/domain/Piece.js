export class Piece {
  constructor({ name, code, quantity = 0, minStock = 0, unitPrice = null }) {
    if (!name || !code) {
      throw new Error("Campos obrigatórios: name e code");
    }

    this.name = name.trim();
    this.code = code.trim().toUpperCase();
    this.quantity = quantity;
    this.minStock = minStock;
    this.unitPrice = unitPrice;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      quantity: this.quantity,
      minStock: this.minStock,
      unitPrice: this.unitPrice,
    };
  }
}
