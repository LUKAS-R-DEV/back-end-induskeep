export class PushSubscription {
  constructor({ endpoint, p256dh, auth, userId }) {
    if (!endpoint) throw new Error("Campo obrigatório: endpoint");
    if (!p256dh) throw new Error("Campo obrigatório: p256dh");
    if (!auth) throw new Error("Campo obrigatório: auth");
    if (!userId) throw new Error("Campo obrigatório: userId");

    this.endpoint = endpoint;
    this.p256dh = p256dh;
    this.auth = auth;
    this.userId = userId;
  }

  toJSON() {
    return {
      endpoint: this.endpoint,
      p256dh: this.p256dh,
      auth: this.auth,
      userId: this.userId,
    };
  }
}



