#!/usr/bin/env node
import 'source-map-support/register';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as cdk from 'aws-cdk-lib';

import { CartApiStack } from '../lib/cart-api-stack';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = new cdk.App();

new CartApiStack(app, 'CartApiStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
