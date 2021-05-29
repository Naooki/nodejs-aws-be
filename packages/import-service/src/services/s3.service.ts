import { S3 } from "aws-sdk";
import path from "path";
import csvParser from "csv-parser";

const s3 = new S3({ signatureVersion: "v4" });

export class S3Service {
  async parseCsvFile({ Bucket, Key }: S3.GetObjectRequest) {
    const getObjectReq = s3.getObject({ Bucket, Key });
    const readStream = getObjectReq.createReadStream();

    return new Promise<any[]>((resolve, reject) => {
      console.log("Starting reading stream...");
      const entries = [];

      readStream
        .pipe(csvParser())
        .on("data", (data) => {
          console.log("Record: ", JSON.stringify(data));
          entries.push(data);
        })
        .on("error", (err) => {
          console.log("Error: ", err);
          reject(err);
        })
        .on("end", () => {
          console.log("Finished reading stream");
          resolve(entries);
        });
    });
  }

  async moveToParsed({ Bucket, Key }: S3.GetObjectRequest) {
    const fileBaseName = path.basename(Key);

    const encoded = encodeURIComponent(fileBaseName);

    const copyParams = {
      Bucket,
      CopySource: `${Bucket}/uploaded/${encoded}`,
      Key: `parsed/${fileBaseName}`,
    };

    console.log("Copying object with params: ", JSON.stringify(copyParams));
    await s3.copyObject(copyParams).promise();
    console.log("Copied");

    console.log(
      "Deleting object with params: ",
      JSON.stringify({ Bucket, Key })
    );
    await s3.deleteObject({ Bucket, Key }).promise();
    console.log("Deleted");
  }
}
