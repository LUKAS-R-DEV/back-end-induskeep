export class User {
  constructor({ name, email, password, role = "TECHNICIAN" }) {
    this.name = name.trim();
    this.email = email.toLowerCase().trim();
    this.password = password;
    this.role = role;
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  }
}
