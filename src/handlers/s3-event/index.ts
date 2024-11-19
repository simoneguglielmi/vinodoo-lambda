import { Handler, S3Event } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { handleErrors } from '../../../shared/handleErrors';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const handler: Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    console.log(`${record.s3.object.key} has been created`);
    const bucketName = record.s3.bucket.name;
    const key = record.s3.object.key;

    try {
      const item = await s3Client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      );

      const body = await item.Body?.transformToString();

      console.log('body', body);
    } catch (error) {
      handleErrors(error, { bucketName, key });
    }
  }
};
