const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    // if no file send error message
    if (!req.file) {
        return res.sendStatus(500);
    }

    // We only want to talk to s3 if we have a file
    // console.log ("file..", req.file)
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedendoftermprojects",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("AWS upload complete!");
            // in order to delete the image we just uploaded to aws
            //from the uploads folder --> fs.unlink(path, () => {})
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("error in s3 upload: ", err);
            res.sendStatus(404);
        });
};
