import { DbClient } from "src/infrastructure/db-client";

export class ProductRepository {
  async findById(id: string) {
    const dbClient = new DbClient();
    await dbClient.connect();

    const res = await dbClient.query(`select * from products where id = '${id}'`);

    dbClient.end();
    return res.rows;
  }

  async findAll({ search, limit }: { search?: string; limit?: number }) {
    const dbClient = new DbClient();
    await dbClient.connect();

    let query = `select * from products`;

    if (search) {
      query += ` as "Product" where "Product"."title" like '%${search}%'`;
    }
    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    const res = await dbClient.query(query);
    dbClient.end();
    return res.rows;
  }
}
