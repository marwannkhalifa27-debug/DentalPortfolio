import "dotenv/config"
import { aws_bucket, aws_region } from "./env/env.config.js"
import { S3Client } from "@aws-sdk/client-s3"

export const s3Client = new S3Client({ region: aws_region})
export const bucketName = aws_bucket