import * as AWS from "aws-sdk";
import { PublishInput, MessageAttributeMap } from "aws-sdk/clients/sns";

export class SNSService {
  private readonly sns = new AWS.SNS();

  publishMessage(
    TopicArn: string,
    Subject: string,
    messageText: string,
    MessageAttributes?: MessageAttributeMap
  ) {
    const now = new Date().toString();
    const Message = `${messageText} \n \n This was sent: ${now}`;

    const params: PublishInput = {
      Message,
      Subject,
      TopicArn,
      MessageAttributes,
    };

    return this.sns.publish(params).promise();
  }
}
