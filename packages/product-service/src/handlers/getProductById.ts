import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import Ajv from "ajv";
import addFormats from "ajv-formats";

import { getProductById } from "src/services";
import { getProductByIdSchema } from "src/schemas";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(getProductByIdSchema);

export const getProductByIdHandler: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  if (!validate(event.pathParameters)) {
    const statusCode = 400;
    const message = `Validation Error`;
    console.log(message);

    return {
      statusCode,
      headers,
      body: JSON.stringify(
        {
          message,
          statusCode,
          errors: validate.errors,
        },
        null,
        2
      ),
    };
  }

  const { productId } = event.pathParameters;
  console.log(`Get product - productId: ${productId}`);
  try {
    const product = await getProductById(productId);

    console.log("Found product: ", JSON.stringify(product));

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
    console.error("Error: ", err);

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
