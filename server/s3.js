// require("dotenv").config();
// const fs = require("fs");
// const S3 = require("aws-sdk/clients/s3");

// const bucketName = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_BUCKET_REGION;
// const accessKeyId = process.env.AWS_ACCESS_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;

// const s3 = new S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
// });

// //upload a file to s3
// const uploadFile = (file) => {
//   const fileStream = fs.createReadStream(file.path);

//   const uploadParams = {
//     Bucket: bucketName,
//     Body: fileStream,
//     Key: file.filename,
//   };
//   return s3.upload(uploadParams).promise();
// };

// exports.uploadFile = uploadFile;

//downloads a file from s3

//v3
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { fromIni } from "@aws-sdk/credential-provider-ini";
// import { Readable } from "stream";
// import dotenv from "dotenv";
// import fs from "fs/promises";

// dotenv.config();

// const bucketName = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_BUCKET_REGION;

// const s3Client = new S3Client({
//   region,
//   credentials: fromIni(),
// });

// const uploadFile = async (file) => {
//   const fileStream = await fs.readFile(file.path);
//   const readableStream = Readable.from(fileStream);

//   const uploadParams = {
//     Bucket: bucketName,
//     Body: readableStream,
//     Key: file.filename,
//   };

//   try {
//     const command = new PutObjectCommand(uploadParams);
//     const data = await s3Client.send(command);
//     console.log("Successfully uploaded object:", data);
//     return data;
//   } catch (error) {
//     console.error("Error uploading object:", error);
//     throw error;
//   }
// };

// export { uploadFile };
