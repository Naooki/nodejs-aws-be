import { S3 } from "aws-sdk";
import path from "path";
import csvParser from "csv-parser";

const s3 = new S3({ signatureVersion: 'v4' });

export class S3Service {
  async parseCsvFile({ Bucket, Key }: S3.GetObjectRequest) {
    const getObjectReq = s3.getObject({ Bucket, Key });
    const readStream = getObjectReq.createReadStream();

    return new Promise<void>((resolve, reject) => {
      console.log("Starting reading stream...");

      readStream
        .pipe(csvParser())
        .on("data", (data) => console.log("Record: ", JSON.stringify(data)))
        .on("error", reject)
        .on("end", resolve);
    }).then(
      () => console.log("Finished reading stream"),
      (err) => console.log("Error: ", err)
    );
  }

  async moveToParsed({ Bucket, Key }: S3.GetObjectRequest) {
    const fileBaseName = path.basename(Key);

    const encoded = encodeURIComponent(fileBaseName);

    const copyParams = {
      Bucket,
      CopySource: `${Bucket}/uploaded/${encoded}`,
      Key: `parsed/${fileBaseName}`,
    };

    console.log('Copying object with params: ', JSON.stringify(copyParams));
    await s3.copyObject(copyParams).promise();
    console.log('Copied');

    console.log('Deleting object with params: ', JSON.stringify({ Bucket, Key }));
    await s3.deleteObject({ Bucket, Key }).promise();
    console.log('Deleted');
  }
}
