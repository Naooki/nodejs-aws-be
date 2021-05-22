import { SQSRecord } from "aws-lambda";

import { createProductsBatch } from "src/services";
import { catalogBatchProcessHandler } from "./catalogBatchProcess";

// can't use const since jest.mock hoists
var mockPublishMessage;

jest.mock("src/services", () => ({
  createProductsBatch: jest.fn(),
  SNSService: function () {
    mockPublishMessage = jest.fn(() => Promise.resolve(null));
    return { publishMessage: mockPublishMessage };
  },
}));

describe("catalogBatchProcess", () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    (createProductsBatch as jest.Mock).mockClear();
    mockPublishMessage.mockClear();
  });

  it("should call createProductsBatch with product data", () => {
    const Records = getMockRecords(5);
    expect(createProductsBatch).not.toHaveBeenCalled();
    catalogBatchProcessHandler({ Records }, null, null);
    expect(createProductsBatch).toHaveBeenCalledTimes(1);
  });

  it("should log error when createProductsBatch fails with the error", async () => {
    const Records = getMockRecords(5);
    (createProductsBatch as jest.Mock).mockRejectedValue({ message: 'test-error' });
    await catalogBatchProcessHandler({ Records }, null, null);
    expect(console.error).toHaveBeenCalledWith(expect.objectContaining({ message: 'test-error' }));
  });

  it("should publish a message into SQS for each record if the products created", async () => {
    const Records = getMockRecords(5);
    (createProductsBatch as jest.Mock).mockResolvedValue(null);
    mockPublishMessage.mockImplementation(() => Promise.resolve(null));
    expect(mockPublishMessage).not.toHaveBeenCalled();

    await catalogBatchProcessHandler({ Records }, null, null);
    expect(mockPublishMessage).toHaveBeenCalledTimes(5);
  });
});

function getMockRecords(quntity: number) {
  // @ts-ignore
  const productsData = new Array(quntity).fill(null).map((el, i) => ({
    title: `test-title-${i}`,
    description: `test-description-${i}`,
    price: Math.floor(Math.random() * 100),
    count: Math.floor(Math.random() * 10),
  }));
  return productsData.map((product) => ({
    body: JSON.stringify(product),
  })) as SQSRecord[];
}
