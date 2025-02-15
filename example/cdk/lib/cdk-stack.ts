import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { buildFrontend } from './process/setup';
import * as deployment from "aws-cdk-lib/aws-s3-deployment";

export interface Config {
  stackName: string;
  bucketName: string;
  appName: string;
  cloudfront: {
    comment: string;
    originAccessControlName: string;
  };
}

interface CloudfrontCdnTemplateStackProps extends cdk.StackProps {
  config: Config;
}

export class CloudfrontCdnTemplateStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CloudfrontCdnTemplateStackProps,
  ) {
    super(scope, id, props);

    const {
      config: {
        bucketName,
        appName,
        cloudfront: { comment, originAccessControlName },
      },
    } = props;

    buildFrontend();

    const s3bucket = new s3.Bucket(this, 'S3Bucket', {
      bucketName,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const oac = new cloudfront.S3OriginAccessControl(this, 'OriginAccessControl', {
      originAccessControlName: originAccessControlName,
      signing: cloudfront.Signing.SIGV4_NO_OVERRIDE,
    });

    const cf = new cloudfront.Distribution(this, 'CloudFront', {
      comment,
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(s3bucket, {
          originAccessControl: oac,
        }),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
      },
      httpVersion: cloudfront.HttpVersion.HTTP3,
    });

    const deployRole = new iam.Role(this, "DeployWebsiteRole", {
      roleName: `${appName}-deploy-role`,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        "s3-policy": new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["s3:*"],
              resources: [`${s3bucket.bucketArn}/`, `${s3bucket.bucketArn}/*`],
            }),
          ],
        }),
      },
    });

    new deployment.BucketDeployment(this, "DeployWebsite", {
      sources: [deployment.Source.asset(`${process.cwd()}/../app/dist`)],
      destinationBucket: s3bucket,
      destinationKeyPrefix: "/",
      exclude: [".DS_Store", "*/.DS_Store"],
      prune: true,
      retainOnDelete: false,
      role: deployRole,
    });

    new cdk.CfnOutput(this, 'AccessURLOutput', {
      value: `https://${cf.distributionDomainName}`,
    });
  }
}
