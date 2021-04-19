import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { getProductById } from "src/services";

export const getProductByIdHandler: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const { productId } = event.pathParameters;
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  console.log(`Get product - productId: ${productId}`);  

  try {
    if (!productId) {
      throw new Error('ProductId is not provided.');
    }

    const product = await getProductById(productId);

    console.log('Found product: ', JSON.stringify(product));

    if (product) {
      const statusCode = 200;
      return {
        statusCode,
        headers,
        body: JSON.stringify(
          {
            message: "Success",
            statusCode,
            product,
          },
          null,
          2
        ),
      };
    } else {
      const statusCode = 404;
      return {
        statusCode,
        headers,
        body: JSON.stringify(
          {
            message: "Product Not Found",
            statusCode,
          },
          null,
          2
        ),
      };
    }
  } catch (err) {
    console.error('Error: ', err);

    const statusCode = 500;

    return {
      statusCode,
      headers,
      body: JSON.stringify(
        {
          message: "Error",
          err,
          statusCode,
        },
        null,
        2
      ),
    };
  }
};
