const AWS = require('aws-sdk');
const RSA = require('node-rsa');
const uuid = require('uuid/v4');

async function generateKeyPair(
  {credentials, endpoint},
  {publicBucket, privateBucket},
  service
) {
  const s3Client = new AWS.S3({
    credentials,
    endpoint
  });

  console.log('Generating public/private keypair');

  const key = new RSA();
  key.generateKeyPair();

  const publicKey = key.exportKey('public');
  const privateKey = key.exportKey('private');

  console.log('Keypair generated');

  const keyId = uuid();

  function uploadFile(bucket, data, file) {
    return new Promise((resolve, reject) => {
      s3Client.upload({
        Bucket: bucket,
        Key: `${bucket}/${service}/${file}`,
        Body: data,
      }, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      })
    })
  }

  console.log('Uploading public key');
  await uploadFile(publicBucket, publicKey, keyId);
  console.log('Public key uploaded');

  console.log('Uploading private key');
  await uploadFile(privateBucket, privateKey, keyId);
  console.log('Private key uploaded');

  console.log('Setting latest keys');
  await uploadFile(publicBucket, keyId, '.latest');
  await uploadFile(privateBucket, keyId, '.latest');
  console.log('Latest key set');
}

module.exports = generateKeyPair;
