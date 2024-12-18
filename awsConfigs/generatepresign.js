const s3 = require('./aws.js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
exports.generatePresignedUrl = async (req, res) => {
    const key = `uploads/${uuidv4()}`;
    const { fileType } = req.query; // Retrieve fileType from query parameters

    // Validate if fileType is provided and is an image MIME type
    if (!fileType) {
        return res.status(400).json({ message: 'File type is required' });
    }
    
    // Validate file type (e.g., image/jpeg, image/png)
    if (!fileType.startsWith('image/')) {
        return res.status(400).json({ message: 'Only image files are allowed' });
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Expires: 300, // 5 minutes
        ContentType: fileType,
        
    };

    try {
        const url = await s3.getSignedUrlPromise('putObject', params);
        res.json({
            url,
            key,
            bucketName: process.env.S3_BUCKET_NAME // Include the bucket name in the response
        });
    } catch (err) {
        console.error('Error generating S3 signed URL:', err);
        res.status(500).send('Could not generate signed URL');
    }
};
