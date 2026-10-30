import multer from "multer"
import { randomUUID } from "crypto"
import sharp from "sharp"
import { bucketName, s3Client } from "../config/S3.config.js"
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3"


const PREFIX = ["cases/", "dentist/"]
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
            .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true})
            .webp({ quality: 80 })
            .toBuffer()
    } catch (error) {
        throw bad("One of the files is not a valid image")
    }
}

export async function removeImages(keys = []){
    const objects = keys
        .filter((k) => typeof k === "string" && k.startsWith(PREFIX))
        .map((Key) => ({ Key }))
    if(!objects.length) return 
    try {
        await s3Client.send(new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: { Objects: objects, Quiet: true}
        }))
    } catch (error) {
        console.log("S3 cleanup failed:", error.message)
    }
}

export async function uploadCaseImages(files = {}){
    const jobs = ["beforeImage", "afterImage", "additionalImages"]
        .flatMap((field) => (files[field] ?? []).map((file) => ({ field, file })))


    const results = await Promise.allSettled(jobs.map(async ({ field, file}) => {
        const Body = await toWebp(file.buffer)
        const Key = `${PREFIX}${randomUUID()}.webp`
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
    const failure = results.find((r) => r.status === "rejected")
    if(failure){
        await removeImages(uploaded.map((u) => u.Key))
        throw failure.reason
    }


    return {
        before: uploaded.find((u) => u.field === "beforeImage")?.Key,
        after: uploaded.find((u) => u.field === "afterImage")?.Key,
        extra: uploaded.filter((u) => u.field === "additionalImages").map((u) => u.Key)
    }
}

export const profileImageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) =>
        ALLOWED.has(file.mimetype) ? cb(null, true) : cb(bad("Only JPEG, PNG or WebP images are allowed")),
}).single("profileImage")

export async function uploadProfileImage(file) {
    if (!file) return undefined
    const Body = await toWebp(file.buffer)
    const Key = `dentist/${randomUUID()}.webp`
    await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key,
        Body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
    }))
    return Key
}