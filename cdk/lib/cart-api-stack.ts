import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

export class CartApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartApiLambda = new nodejs.NodejsFunction(this, 'CartApiLambda', {
      functionName: 'cartApi',
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../src/lambda.ts'),
      handler: 'handler',
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        minify: false,
        keepNames: true,
        externalModules: [
          '@nestjs/microservices',
          '@nestjs/websockets',
          '@nestjs/platform-socket.io',
          'cache-manager',
          'class-transformer',
          'class-validator',
        ],
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
