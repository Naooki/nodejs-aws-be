import { APIGatewayProxyEvent } from "aws-lambda";
import { getProductById } from "src/services";

import { getProductByIdHandler } from "./getProductById";

jest.mock("src/services", () => ({
  getProductById: jest.fn(),
}));

describe("getProductById", () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  it("should return 200 response and the product data when the product exists", async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { productId: "5070661a-b85a-48d4-9a47-7882d85ff1b2" },
    } as any;

    (getProductById as jest.Mock).mockResolvedValueOnce({ title: "test-product" });

    const resp: any = await getProductByIdHandler(event, null, null);
    const body = JSON.parse(resp.body);
    expect(body).toEqual({
      message: "Success",
      statusCode: 200,
      product: { title: "test-product" },
    });
  });

  it("should return 404 error when the product not found", async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { productId: "5070661a-b85a-48d4-9a47-7882d85ff1b2" },
    } as any;

    (getProductById as jest.Mock).mockResolvedValueOnce(null);

    const resp: any = await getProductByIdHandler(event, null, null);
    const body = JSON.parse(resp.body);
    expect(body).toEqual({
      message: "Product Not Found",
      statusCode: 404,
    });
  });

  it("should return 400 error when service fails", async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { productId: "5070661a-b85a-48d4-9a47-7882d85ff1b2" },
    } as any;

    (getProductById as jest.Mock).mockRejectedValueOnce(null);

    const resp: any = await getProductByIdHandler(event, null, null);
    const body = JSON.parse(resp.body);
    expect(body).toEqual({
      err: null,
      message: "Error",
      statusCode: 500,
    });
  });
});
