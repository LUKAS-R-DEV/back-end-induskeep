export class PasswordResetToken {
    constructor({ token, userId,expiresAt }){
        if(!token || !userId || !expiresAt){
            throw new Error("Campos obrigatórios: token, userId e expiresAt");
    }
        this.token = token;
        this.userId = userId;
        this.expiresAt = expiresAt;
    }
    toJson() {
        return {
          token: this.token,
          userId: this.userId,
          expiresAt: this.expiresAt
        };
      }
}