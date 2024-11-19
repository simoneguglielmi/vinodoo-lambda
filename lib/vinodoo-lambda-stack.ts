import config from '../shared/configurations';
import { Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class VinodooLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'VinodooFeeds', {
      bucketName: 'vinodoo-feeds',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const fn = new NodejsFunction(this, 'VinodooS3NotificationLambda', {
      entry: config.handlers['s3-event'].path,
      handler: config.handlers['s3-event'].handler,
      runtime: Runtime.NODEJS_20_X,
      reservedConcurrentExecutions: config.reservedConcurrentExecutions,
      timeout: Duration.seconds(config.timeout),
    });

    const s3EventSource = new S3EventSource(bucket, {
      events: [EventType.OBJECT_CREATED],
    });

    fn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    fn.addToRolePolicy(
      new PolicyStatement({
        actions: [
          's3:GetBucketNotification',
          's3:PutBucketNotification',
          's3:GetObject',
        ],
        effect: Effect.ALLOW,
        resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
      })
    );

    fn.addEventSource(s3EventSource);
  }
}
