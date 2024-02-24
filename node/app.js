const express = require("express")
const stream = require("stream")
const multer = require("multer")
const path = require("path")
const cors = require("cors")
const {google} = require("googleapis")

const app = express()
const upload = multer()

app.use(express.json())
app.use(cors())


const KEYFILEPATH = path.join(__dirname, "cred.json");

//const KEYFILEPATH = new URL("./googleCredApi.json", import.meta.url).pathname; // for es6 module

const SCOPE = ["https://www.googleapis.com/auth/drive"]
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPE
})

app.post("/uploadToGoogleDrive", upload.single('image'), async(req, res)=>{
    try {
        const drive = google.drive({version: 'v3', auth:auth})
        const fileMetaData = {
            name: req.file.originalname,
            parents: ["16_ai2PT7kr9WTSW7IIDVT4utRptfUANs"]
        }
        const bufferStream = new stream.PassThrough()
        bufferStream.end(req.file.buffer)

        const media = {
            mimeType: req.file.mimetype,
            body: bufferStream
        }
        const file = await drive.files.create({
            requestBody: fileMetaData,
            media
        })


       // Generate the publicly accessible URL
       const imageUrl1 = `https://drive.google.com/uc?export=view&id=${file.data.id}`; //use as user content for public use
       const imageUrl2 = `https://drive.google.com/file/d/${file.data.id}` // view as google drive image
       console.log("URL 1: ", imageUrl1)
       console.log("URL 2: ", imageUrl2)
       res.status(200).json({ status: 'success', statusCode: 200, url: imageUrl1, message: 'Image successfully uploaded to drive' });

    } catch (error) {
        console.log("ERROR UPLOADING IS: ", error.message);
       res.status(500).json({ status: 'error', statusCode: 500, message: error.message || 'Failed to save image to Drive' });

    }
})



app.listen(5050, ()=>{
    console.log("Backend is running on port 5050")
})