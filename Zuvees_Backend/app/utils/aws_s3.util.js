require("dotenv").config();

const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: `${process.env.AWS_REGION}`,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

async function getObjectUrl(key) {
  const command = new GetObjectCommand({
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}

async function putImageObject(filepath) {
  const command = new PutObjectCommand({
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `${filepath}`,
    ContentType: "image/jpeg",
  });
  const url = getSignedUrl(s3Client, command);
  return url;
}

async function putPDFObject(filepath) {
  const command = new PutObjectCommand({
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `${filepath}`,
    ContentType: "application/pdf",
  });
  const url = getSignedUrl(s3Client, command);
  return url;
}

async function putFileObject(filepath, fileType) {
  const command = new PutObjectCommand({
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `${filepath}`,
    ContentType: fileType,
  });
  const url = getSignedUrl(s3Client, command);
  return url;
}

async function checkFileExists(filepath) {
  try {
    const command = new HeadObjectCommand({
      Bucket: `${process.env.AWS_BUCKET_NAME}`,
      Key: `${filepath}`,
    });
    const response = await s3Client.send(command);
    const exist = response.$metadata.httpStatusCode === 200;
    return exist;
  } catch (error) {
    console.log(error);
    if (
      error.$metadata.httpStatusCode === 404 ||
      error.$metadata.httpStatusCode === 403
    )
      return false;
  }
}

async function deleteObject(filepath) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filepath,
    });
    const response = await s3Client.send(command);
    return response.$metadata.httpStatusCode === 204;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function putObject(leadID, filetype) {
  const command = new PutObjectCommand({
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `uploads/${leadID}/${filetype}`,
    ContentType: "image/jpeg",
  });
  const url = getSignedUrl(s3Client, command);
  return url;
}

async function getObjectUrl(key) {
  const command = new GetObjectCommand({
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}

module.exports = {
  putImageObject,
  getObjectUrl,
  putPDFObject,
  putFileObject,
  checkFileExists,
  deleteObject,
  putObject,
};
