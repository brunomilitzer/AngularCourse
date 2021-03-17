export class User {

  constructor(
    public email: string,
    public id: string,
    private _TOKEN: string,
    private _TOKEN_EXPIRATION_DATE: Date) {}

    get token(): string {
      if (!this._TOKEN_EXPIRATION_DATE || new Date() > this._TOKEN_EXPIRATION_DATE) {
        return null;
      }

      return this._TOKEN;
    }
}
