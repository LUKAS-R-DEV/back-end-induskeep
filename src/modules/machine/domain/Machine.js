export class Machine {
  constructor({ name, serial, location = null, userId }) {
    if (!name || !serial || !userId) {
      throw new Error("Campos obrigatórios: name, serial e userId");
    }

    this.name = name.trim();
    this.serial = serial.trim().toUpperCase();
    this.location = location ? location.trim() : null;
    this.status = "ACTIVE";
    this.userId = userId;
  }

  toJSON() {
    return {
      name: this.name,
      serial: this.serial,
      location: this.location,
      status: this.status,
      userId: this.userId,
    };
  }
}
