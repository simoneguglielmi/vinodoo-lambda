import { NoSuchKey, S3ServiceException } from '@aws-sdk/client-s3';

export function handleErrors(
  error: unknown,
  s3Props: { bucketName: string; key: string }
): void {
  const { bucketName, key } = s3Props;

  if (error instanceof NoSuchKey) {
    console.error(
      `NoSuchKey Error: The object "${key}" does not exist in the bucket "${bucketName}".`
    );
  } else if (error instanceof S3ServiceException) {
    console.error(
      `S3ServiceException: An error occurred while accessing the bucket "${bucketName}". ${error.name}: ${error.message}`
    );
  } else if (error instanceof Error) {
    console.error('An error occurred:', error.message);
  } else {
    console.error('An unknown error occurred:', error);
  }
}
