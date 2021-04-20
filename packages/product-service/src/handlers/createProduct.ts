import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { createProduct } from "src/services";

export const createProductHandler: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const productData = JSON.parse(event.body);
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  console.log(`Create product: ${JSON.stringify(productData)}`);  

  // TODO: VALIDATE
  if (false) {
    const statusCode = 400;
    const message = `Error: Invalid product data!`;
    console.log(message);

    return {
      statusCode,
      headers,
      body: JSON.stringify(
        {
          message,
          statusCode,
        },
        null,
        2
      ),
    };
  }

  try {
    const product = await createProduct(productData);

    console.log('Created product: ', JSON.stringify(product));

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
