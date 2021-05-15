import { S3 } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

const s3 = new S3({ signatureVersion: "v4" });

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
    Bucket: process.env.uploadBucket,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", {
      ...signedUrlParams,
    });
    console.log("Signed URL:", signedUrl);

    return {
      statusCode: 200,
      headers,
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
