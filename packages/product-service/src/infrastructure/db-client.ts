import { Client } from "pg";

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export class DbClient {
  private _client: Client;

  constructor() {
    this._client = new Client({
      host: PG_HOST,
      port: +PG_PORT,
      database: PG_DATABASE,
      user: PG_USERNAME,
      password: PG_PASSWORD,
    });
  }

  async connect() {
    console.log(`Connecting to: ${this._client.host}, database: ${this._client.database}...`);
    await this._client.connect();
    console.log('Connected!');
    return this._client;
  }

  async query(query: string) {
    console.log(`Executing query: ${query}`);
    const res = await this._client.query(query);
    console.log('Executed.')
    return res;
  }

  async end() {
    console.log('Closing the connection...');
    await this._client.end();
    console.log('Closed.')
  }
}
