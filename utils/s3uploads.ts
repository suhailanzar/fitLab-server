import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";


 const s3config = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
    },
    region: process.env.S3_REGION
})

const uploadS3Video = async (file : any,)=>{
    const params = {
        Bucket: process.env.S3_BUCKET_COURSES,
        Key: Date.now().toString() + '-' + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline'
    };

    
    console.log('uploading video: ', params)
    return new Upload({
        client : s3config,
        params : params
    }).done()
    .then(data => {
        console.log('data from bucket', data)
        return data
    })
    .catch(err =>{
        return {error : true, msg : err}
    })

}

const uploadS3Image = async (file : any)=>{
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: Date.now().toString() + '-' + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline'
    };

    
    console.log('uploading image: ', params)
    return new Upload({
        client : s3config,
        params : params
    }).done()
    .then(data => {
        console.log('data from bucket', data)
        return data
    })
    .catch(err =>{
        return {error : true, msg : err}
    })

}

const uploadS3ProfileImage = async (file : any)=>{
    const params = {
        Bucket: process.env.S3_BUCKET_PROFILE,
        Key: Date.now().toString() + '-' + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline'
    };

    
    console.log('uploading image: ', params)
    return new Upload({
        client : s3config,
        params : params
    }).done()
    .then(data => {
        console.log('data from bucket', data)
        return data
    })
    .catch(err =>{
        return {error : true, msg : err}
    })

}


export {uploadS3Image, uploadS3ProfileImage, uploadS3Video}