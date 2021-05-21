import { S3Service } from "src/services/s3.service";
import { SQSService } from "src/services/sqs.service";

const s3Service = new S3Service();
const sqsService = new SQSService();

export const importFileParserHandler = async (event) => {
  const Bucket = event.Records[0].s3.bucket.name;
  console.log("Backet name: ", Bucket);
  const Key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  console.log("S3 Bucket name: ", Bucket);
  console.log("S3 Object key: ", Key);

  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const entries = await s3Service.parseCsvFile({ Bucket, Key });

    const sendMessages = sqsService.sendItems(entries);
    const moveToParsed = s3Service.moveToParsed({ Bucket, Key });
    await Promise.all([sendMessages, moveToParsed]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Success",
      }),
    };
  } catch (err) {
    console.log("Finishing handling with error: ", err);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: err,
      }),
    };
  }
};
