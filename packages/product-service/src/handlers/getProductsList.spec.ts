import { APIGatewayProxyEvent } from "aws-lambda";
import { getProducts } from "src/services";

import { getProductsListHandler } from "./getProductsList";

jest.mock("src/services", () => ({
  getProducts: jest.fn(),
}));

describe("getProducts", () => {
  it("should return 200 response and the products", async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: {},
    } as any;

    (getProducts as jest.Mock).mockResolvedValueOnce([
      { title: "test-product" },
    ]);

    const resp: any = await getProductsListHandler(event, null, null);
    const body = JSON.parse(resp.body);
    expect(body).toEqual({
      message: "Success",
      statusCode: 200,
      products: [{ title: "test-product" }],
    });
  });

  it("should return 400 error when the product not found", async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: {},
    } as any;

    (getProducts as jest.Mock).mockRejectedValueOnce({ err: 'test-error', params: {} });

    const resp: any = await getProductsListHandler(event, null, null);
    const body = JSON.parse(resp.body);
    expect(body).toEqual({
      message: "Error",
      statusCode: 400,
      err: 'test-error',
      params: {}
    });
  });
});
