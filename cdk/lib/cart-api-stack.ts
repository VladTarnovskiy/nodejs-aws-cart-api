import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export class CartApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartApiLambda = new lambda.Function(this, 'CartApiLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'src/lambda.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.lambda-package'),
      ),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {
        DB_HOST: process.env.DB_HOST ?? '',
        DB_PORT: process.env.DB_PORT ?? '5432',
        DB_USER: process.env.DB_USER ?? '',
        DB_PASSWORD: process.env.DB_PASSWORD ?? '',
        DB_NAME: process.env.DB_NAME ?? 'postgres',
        DB_SSL: process.env.DB_SSL ?? 'true',
      },
    });

    const httpApi = new apigwv2.HttpApi(this, 'CartHttpApi', {
      apiName: 'cart-api',
      defaultIntegration: new integrations.HttpLambdaIntegration(
        'CartLambdaIntegration',
        cartApiLambda,
      ),
    });

    new cdk.CfnOutput(this, 'CartApiUrl', {
      value: httpApi.url ?? '',
      description: 'Cart API Gateway URL',
    });
  }
}
