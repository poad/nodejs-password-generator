#!/usr/bin/env node
import 'source-map-support/register';
import {
  CloudfrontCdnTemplateStack,
  Config,
} from '../lib/cdk-stack';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const config = app.node.tryGetContext('config') as Config;

new CloudfrontCdnTemplateStack(app, config.stackName, {
  config,
  env: {
    account: app.account,
    region: app.region,
  },
});
