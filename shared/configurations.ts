export default {
  handlers: {
    's3-event': {
      path: './src/handlers/s3-event/index.ts',
      handler: 'handler',
    },
  },
  reservedConcurrentExecutions: 1,
  timeout: 300,
  account: {
    id: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
  },
};
