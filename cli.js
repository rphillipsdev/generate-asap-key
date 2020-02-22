#!/usr/bin/env node

const meow = require('meow');
const upload = require('./index');

const cli = meow(`
  Usage
    $ generate-asap-key <service>
    
  Options
    --key-id -k AWS Access Key (Default: 'test')
    --secret-key -s AWS Secret Key (Default: 'test')
    --development, -d Enables development mode, uploads to localstack
    --public-bucket, -o Public ASAP key bucket
    --private-bucket, -c Private ASAP key bucket
`, {
  flags: {
    accessKeyId: {
      type: 'string',
      alias: 'k',
      default: 'test'
    },
    secretAccessKey: {
      type: 'string',
      alias: 's',
      default: 'test'
    },
    development: {
      type: 'boolean',
      alias: 'd',
    },
    publicKeyBucket: {
      type: 'string',
      alias: 'o',
      default: 'plat-asap-public-bucket'
    },
    privateKeyBucket: {
      type: 'string',
      alias: 'c',
      default: 'plat-asap-private-bucket'
    }
  }
});

const [service] = cli.input;
const {
  accessKeyId,
  secretAccessKey,
  development,
  publicKeyBucket,
  privateKeyBucket
} = cli.flags;

const awsConf = {
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint: development ? 'http://localhost:4572' : undefined
};

const bucketConf = {
  publicBucket: publicKeyBucket,
  privateBucket: privateKeyBucket
};

upload(awsConf, bucketConf, service);
