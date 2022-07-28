const multerS3 = require("multer-s3");
const multer = require("multer");
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "us-east-1",
});

const s3 = new aws.S3();

const bucket = "bouncebox-bucket";

//upload file
async function uploadFile(file, dir) {
 try {
   //convert object to string
   let fileString = JSON.stringify(file);

   let bufferr = Buffer.from(fileString, "utf8");
 
   let params = {
     Bucket: bucket,
     Key: dir,
     Body: Buffer.from(file, "binary"),
   };
   let data = await s3.upload(params).promise();
   return data;
  
 } catch (error) {
   console.log(error);
 }
  
 
}

//upload files
async function uploadFiles(files, dir1, key) {
  //run a loop and wait for all files to be uploaded
  let upload_data = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let dir = key + "/" + dir1[i];

    let data = await uploadFile(file, dir);
    //wait for all files to be uploaded
    upload_data.push(data);
  }
  return upload_data;
}


//delete folder form s3
async function deleteFolder(dir) {
  try {
    console.log(dir);
  //  listObjectsV2
    let params = {
      Bucket: bucket,
      Prefix: dir,
    };
    let data = await s3.listObjectsV2(params).promise();
    let objects = data.Contents;
    let deleteParams = {
      Bucket: bucket,
      Delete: {
        Objects: [],
        Quiet: false,
      },
    };
    for (let i = 0; i < objects.length; i++) {
      let obj = objects[i];
      deleteParams.Delete.Objects.push({
        Key: obj.Key,
      });
    }
    let data1 = await s3.deleteObjects(deleteParams).promise();
    return data1;

  } catch (error) {
    console.log(error);
  }
}




module.exports = { uploadFile, uploadFiles, deleteFolder };
