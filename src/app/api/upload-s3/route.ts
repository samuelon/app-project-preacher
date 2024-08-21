import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Set the region and access keys
  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
  });

  // Create a new instance of the S3 class
  const s3 = new AWS.S3();

  // Set the parameters for the file you want to upload
  const params = {
    Bucket: 'jack-preacher-images',
    Key: file.name,
    Body: buffer
  };

  // Upload the file to S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.log('Error uploading file:', err);
    } else {
      console.log('File uploaded successfully. File location:', data.Location);
    }
  });
  return NextResponse.json({ success: true });
}
