import fs from "fs"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { 
    S3Client, 
    PutObjectCommand, 
    ListObjectsCommand, 
    GetObjectCommand, 
    DeleteObjectCommand} from "@aws-sdk/client-s3";
import { 
    AWS_BUCKET_NAME, 
    AWS_BUCKET_REGION, 
    AWS_PUBLIC_KEY, 
    AWS_SECRET_KEY } from "./config.js"

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    } 
})

export async function uploadFile(file) {
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    }

    const command = new PutObjectCommand(uploadParams)
    // console.log("s3: ",command)
    return await client.send(command)
}

export async function uploadFileWithID(file, idInstitution, idFile, extension) {
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: idInstitution + "-" + idFile + "." + extension.toLowerCase(),
        Body: stream
    }

    const command = new PutObjectCommand(uploadParams)
    // console.log("s3: ",command)
    return await client.send(command)
}

export async function uploadImageInstituion(file, idInstitution) {
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: "ID-INST-" + idInstitution,
        Body: stream
    }

    const command = new PutObjectCommand(uploadParams)
    // console.log("s3: ",command)
    return await client.send(command)
}

export async function getFiles(file) {
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    })
    return await client.send(command)
}

export async function getFile(fileName) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    })
    return await client.send(command)
}

export async function downloadFile(fileName) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    })
    const result = await client.send(command)
    console.log(result)
    result.Body.pipe(fs.createWriteStream(`./images/${fileName}`))
}

export async function getFileURL(fileName) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    })
    return await getSignedUrl(client, command, { expiresIn: 3600})
}

//delete file
export async function deleteFile(fileName) {
    const command = new DeleteObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    })
    return await client.send(command)
}