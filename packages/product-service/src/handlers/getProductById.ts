import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { getProductById } from "src/services";

export const getProductByIdHandler: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const { productId } = event.pathParameters;

  try {
    const product = await getProductById(productId);

    if (product) {
      const statusCode = 200;
      return {
        statusCode,
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
    const statusCode = 400;

    return {
      statusCode,
      body: JSON.stringify(
        {
          message: "Error",
          statusCode,
        },
        null,
        2
      ),
    };
  }
};
