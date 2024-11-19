import config from '../shared/configurations';
import { Stack, StackProps, RemovalPolicy, Duration, Arn } from 'aws-cdk-lib';
import { Runtime, FunctionUrlAuthType, Code } from 'aws-cdk-lib/aws-lambda';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

// import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

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
        actions: ['s3:GetBucketNotification', 's3:PutBucketNotification'],
        effect: Effect.ALLOW,
        resources: [bucket.bucketArn],
      })
    );

    fn.addEventSource(s3EventSource);

    // new LambdaRestApi(this, 'VinodooLambdaApi', {
    //   handler: fn,
    // });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'VinodooLambdaQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
