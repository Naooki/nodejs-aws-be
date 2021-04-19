import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { getProducts } from "src/services";

export const getProductsListHandler: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const params = event.queryStringParameters || {};
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  console.log(`Get products: Params: ${JSON.stringify(params)}`);

  try {
    if (params.limit && !+params.limit) {
      throw new Error('Invalid request params.');
    }

    const products = await getProducts(params);
    const statusCode = 200;

    console.log('Found products: ', JSON.stringify(products));

    return {
      statusCode,
      headers,
      body: JSON.stringify(
        {
          message: "Success",
          statusCode,
          products,
        },
        null,
        2
      ),
    };
  } catch (e) {
    console.error(`Error: ${e}`);

    const statusCode = 500;

    return {
      statusCode,
      headers,
      body: JSON.stringify(
        {
          message: "Error",
          statusCode,
          err: e.err,
          params,
        },
        null,
        2
      ),
    };
  }
};
