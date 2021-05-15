import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { importProductFileHandler } from "./importProductFile";

jest.mock("aws-sdk", () => ({
  S3: function () {
    return {
      getSignedUrlPromise: jest
        .fn()
        .mockResolvedValueOnce("test-signed-url")
        .mockRejectedValueOnce("test-error"),
    };
  },
}));

console.log = jest.fn();
console.error = jest.fn();

describe("importProductFile", () => {
  beforeEach(() => {});

  it("should return 200 status code response with the signed url", async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: { name: "test-name" },
    } as any;

    const resp = await importProductFileHandler(event, null, null);
    expect(resp).toEqual(
      expect.objectContaining({ statusCode: 200, body: "test-signed-url" })
    );
  });

  it("should return 500 status code with the error when getSignedUrlPromise fails", async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: { name: "test-name" },
    } as any;

    const resp = (await importProductFileHandler(
      event,
      null,
      null
    )) as APIGatewayProxyResult;
    const body = JSON.parse(resp.body);
    expect(body).toEqual(
      expect.objectContaining({
        message: "Error",
        err: "test-error",
        statusCode: 500,
      })
    );
  });
});
