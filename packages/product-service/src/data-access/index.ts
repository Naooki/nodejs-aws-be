import { DbClient } from "src/infrastructure/db-client";

export class ProductRepository {
  async findById(id: string) {
    const dbClient = new DbClient();
    await dbClient.connect();

    const res = await dbClient.query(
      `select products.id, title, description, price, count from products LEFT JOIN stocks ON stocks.product_id = products.id where products.id = '${id}'`
    );

    dbClient.end();
    return res.rows;
  }

  async findAll({ search, limit }: { search?: string; limit?: number }) {
    const dbClient = new DbClient();
    await dbClient.connect();

    let query = `select products.id, title, description, price, count from products LEFT JOIN stocks ON stocks.product_id = products.id`;

    if (search) {
      query += ` where products.title like '%${search}%'`;
    }
    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    const res = await dbClient.query(query);
    dbClient.end();
    return res.rows;
  }
}
