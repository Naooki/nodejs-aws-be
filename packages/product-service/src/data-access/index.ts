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

  async create({ title, description, price, count }: any) {
    const dbClient = new DbClient();
    const client = await dbClient.connect();

    let item: Partial<any>;

    try {
      console.log('BEGIN');
      await client.query('BEGIN');
      const productsQuery = `insert into products (title, description, price) values ($1, $2, $3) returning id, title, description, price`;
      const productsQueryRes = await client.query(productsQuery, [title, description, price]);
      const product = productsQueryRes.rows[0];
      const stocksQuery = `insert into stocks (product_id, count) values ($1, $2) returning count`;
      const stocksQueryRes = await client.query(stocksQuery, [product.id, count]);
      item = {
        ...product,
        count: stocksQueryRes.rows[0].count
      };
      await client.query('COMMIT');
      console.log('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.log('ROLLBACK');
      throw e;
    }

    dbClient.end();
    return item;
  }
}
