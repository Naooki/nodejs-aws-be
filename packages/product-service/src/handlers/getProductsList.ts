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

  try {
    const products = await getProducts(params);
    const statusCode = 200;
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
  } catch ({ err, params }) {
    const statusCode = 500;

    return {
      statusCode,
      headers,
      body: JSON.stringify(
        {
          message: "Error",
          statusCode,
          err,
          params,
        },
        null,
        2
      ),
    };
  }
};
