import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export class CartApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartApiLambda = new lambda.DockerImageFunction(
      this,
      'CartApiLambda',
      {
        code: lambda.DockerImageCode.fromImageAsset(
          path.join(__dirname, '../..'),
          { cmd: ['src/lambda.handler'] },
        ),
        memorySize: 512,
        timeout: cdk.Duration.seconds(30),
      },
    );

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
