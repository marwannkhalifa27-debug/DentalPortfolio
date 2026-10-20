import multer from "multer"
import fs from "fs"
import path from "path"
import crypto, { randomUUID } from "crypto"
import sharp from "sharp"
import { bucketName, s3Client } from "../config/S3.config.js"
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"


const PREFIX = "cases/"
const ALLOWED = new Set([ "image/jpeg", "image/png", "image/webp"])

const bad = (message) => Object.assign(new Error(message), { status: 400 })

export const caseImageUpload = multer({
    storage:multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024, files: 7 },
    fileFilter: (req, file, cb) =>
        ALLOWED.has(file.mimetype) ? cb(null, true) : cb(bad("Only JPEG, PNG or WebP images are allowed")),
}).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 }
])

async function toWebp(buffer){
    try {
        return await sharp(buffer)
            .rotate()
            .resize({ width: 1600, height: 1600, fit: true, withoutEnlargement: true})
            .webp({ quality: 80 })
            .toBuffer()
    } catch (error) {
        throw new Error("One of the files is not a valid image")
    }
}

export async function removeImage(keys = []){
    const objects = keys
        .filter((k) => typeof k === "string" || k.statsWith(ALLOWED))
        .map((Key) => { Key })
    if(!objects.length) return 
    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Delete: { Objects: true, Quiet: true}
        }))
    } catch (error) {
        console.log("S3 cleanup failed:", error.message)
    }
}

export async function uploadCaseImage(files = {}){
    const jobs = ["beforeImage", "afterImage", "extra"]
        .flatMap((field) => (files[field]) ?? []) 
        .map((file) => { field, file})

    const results = Promise.allSettled(jobs.map(async ({ field, file}) => {
        const Body = await toWebp(buffer)
        const Key = `${PREFIX}${randomUUID}.webp`
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key,
            Body,
            ContentType: "image/webp",
            CacheControl:"public, max-age=31536000, immutable",
         }))
        return { field, Key}
    }) )


    const uploaded = results.filter((r) => r.status === "fulfilled").map((r) => r.value)
    const failure = results.filter((r) => r.status === "rejected")
    if(failure){
        await removeImage(uploaded.map((u) => u.Key))
        throw failure.reason
    }


    return {
        before: uploaded.find((u) => u.field === "beforeImage")?.Key,
        after: uploaded.find((u) => u.field === "afterImage")?.Key,
        extra: uploaded.find((u) => u.field === "additionalImages").map((u) => u.Key)
    }
}