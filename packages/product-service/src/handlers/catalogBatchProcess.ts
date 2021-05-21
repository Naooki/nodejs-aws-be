import Ajv from "ajv";
import { SQSHandler } from "aws-lambda";

import { createProductSchema } from "src/schemas";
import { createProductsBatch } from "src/services";
import { SNSService } from "src/services/sns.service";

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(createProductSchema);

const snsService = new SNSService();

export const catalogBatchProcessHandler: SQSHandler = async (event) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  // format data
  const products = event.Records.map((record) => {
    const productData = JSON.parse(record.body);
    if (productData?.price) {
      productData.price = +productData.price;
    }
    if (productData?.count) {
      productData.count = +productData.count;
    }
    return productData;
  });

  const invalidProduct = products.find((product) => !validate(product));
  if (invalidProduct) {
    console.log(`Invalid product: ${JSON.stringify(invalidProduct)}`);
    throw new Error("InvalidProduct");
  }

  try {
    const result = await createProductsBatch(products);
    console.log(`Create result: ${JSON.stringify(result)}`);
  } catch (err) {
    console.error(err);
    return;
  }

  try {
    const isLast = event.Records.find(
      (rec) =>
        rec.messageAttributes.messageAttr &&
        rec.messageAttributes.messageAttr.stringValue === "last"
    );
    if (isLast) {
      const topicArn = process.env.snsArn;
      console.log(`Sending email notification: ${topicArn}`);
      const subject = "Products successfully created.";
      const message = "Products have been successfully added to the table.";
      await snsService.publishMessage(topicArn, subject, message);
    }
  } catch (err) {
    console.log(err);
  }
};
