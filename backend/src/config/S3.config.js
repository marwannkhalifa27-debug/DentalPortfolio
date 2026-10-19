import "dotenv/config"
import { aws_bucket, aws_profile, aws_region } from "./env/env.config.js"
import { fromIni } from "@aws-sdk/credential-providers"
import { S3Client } from "@aws-sdk/client-s3"


const region = aws_region
if(!region) throw new Error("Missing region")

const s3Config = {
    region
}

if(process.env.NODE_ENV !== "production"){
    s3Config.credentials = fromIni({
        profile: aws_profile || "marwann-277"
    })
}

export const s3Client = new S3Client(s3Config)
export const bucketName = aws_bucket

if(!bucketName) throw new Error("Missing bucket name")