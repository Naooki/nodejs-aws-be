import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

export const getProductByIdHandler: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const { productId } = event.pathParameters;

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(
      {
        message: "Success",
        product: `Product ID: ${productId}`,
      },
      null,
      2
    ),
  };

  // try {
  //   const product = await getProductById(productId);
  //   return {
  //     statusCode: 200,
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify(
  //       {
  //         message: "Success",
  //         product,
  //       },
  //       null,
  //       2
  //     ),
  //   };
  // } catch (err) {
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify(
  //       {
  //         message: "Error",
  //       },
  //       null,
  //       2
  //     ),
  //   };
  // }
};
