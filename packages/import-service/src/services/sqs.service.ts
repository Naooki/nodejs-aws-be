import { SQS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const sqs = new SQS();
const QueueUrl = process.env.sqsUrl;

export class SQSService {
  sendItems(items: any[]) {
    const Entries = items.map((item, i, msgs) => ({
      Id: uuidv4() as string,
      MessageBody: JSON.stringify(item),
      MessageAttributes:
        i === msgs.length - 1
          ? {
              messageAttr: {
                DataType: "String",
                StringValue: "last",
              },
            }
          : {},
    }));

    console.log(`Sending items to: ${QueueUrl}`);
    const params: SQS.SendMessageBatchRequest = {
      QueueUrl,
      Entries,
    };
    return sqs.sendMessageBatch(params).promise();
  }
}
