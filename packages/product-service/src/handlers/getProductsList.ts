import Ajv, { JSONSchemaType } from "ajv";
import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { getProducts } from "src/services";

const ajv = new Ajv({ allErrors: true });
const schema: JSONSchemaType<{ search?: string, limit?: number }> = {
  type: "object",
  properties: {
    search: { type: "string" },
    limit: { type: "number", minimum: 1 }
  },
  additionalProperties: false,
};
const validate = ajv.compile(schema);

export const getProductsListHandler: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const params: { search?: string, limit?: number } = {};
  if (event.queryStringParameters?.search) {
    params.search = event.queryStringParameters?.search;
  }

  if (event.queryStringParameters?.limit) {
    params.limit = +event.queryStringParameters.limit;
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  if (!validate(params)) {
    const statusCode = 400;
    const message = 'Validation Error';
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

  console.log(`Get products: Params: ${JSON.stringify(params)}`);

  try {
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
