import { environment } from '../../environments/environment';

export abstract class DbCredentialsService {
  private API_KEY = environment.firebaseAPIKey;
  private URL = 'https://recipe-869ba-default-rtdb.europe-west1.firebasedatabase.app/';
  private SCHEMA = 'recipes.json';
  private SIGN_UP_ENDPOINT = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  private LOGIN_ENDPOINT = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

  protected get url(): string {
    return this.URL + this.SCHEMA;
  }

  protected get signUpEndpoint(): string {
    return this.SIGN_UP_ENDPOINT + this.apiKey;
  }

  protected get loginEndpoint(): string {
    return this.LOGIN_ENDPOINT + this.apiKey;
  }

  private get apiKey(): string {
    return this.API_KEY;
  }
}
