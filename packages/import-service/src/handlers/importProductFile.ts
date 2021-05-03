import { S3 } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

const s3 = new S3();

export const importProductFileHandler: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  const fileName = event.queryStringParameters.name;
  console.log("Request: import product file: ", fileName);

  const signedUrlParams = {
    Bucket: process.env.UPLOAD_BUCKET,
    Key: `uploaded/${fileName}`,
  };

  try {
    const signedUrl = await s3.getSignedUrl("putObject", signedUrlParams);
    console.log("Signed URL:", signedUrl);

    return {
      statusCode: 200,
      body: signedUrl,
    };
  } catch (err) {
    console.error("Error: ", err);

    const statusCode = 500;
    return {
      statusCode,
      headers,
      body: JSON.stringify(
        {
          message: "Error",
          err,
          statusCode,
        },
        null,
        2
      ),
    };
  }
};
