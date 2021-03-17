export class DatabaseCredentialsService {
  private dbUrl = 'https://recipe-869ba-default-rtdb.europe-west1.firebasedatabase.app/';
  private dbSchema = 'recipes.json';

  protected getDbUrl(): string {
    return this.dbUrl;
  }

  protected getDbSchema(): string {
    return this.dbSchema;
  }

  protected getDbFullUrl(): string {
    return this.dbUrl + this.dbSchema;
  }
}
