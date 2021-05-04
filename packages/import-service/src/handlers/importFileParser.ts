import { S3Handler } from "aws-lambda";
import { S3Service } from "src/services/s3.service";

const s3Service = new S3Service();

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
    await s3Service.parseCsvFile({ Bucket, Key });
    await s3Service.moveToParsed({ Bucket, Key });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Success',
      })
    };
  } catch (err) {
    console.log("Finishing handling with error: ", err);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: err,
      })
    };
  }
};
