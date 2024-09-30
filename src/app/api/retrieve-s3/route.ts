import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import AWS from 'aws-sdk';

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    // Extract the image file name from query parameters
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json({ message: 'File name is required' }, { status: 400 });
    }
    // Set the region and access keys
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
    });

    // Create a new instance of the S3 class
    const s3 = new AWS.S3();

    // Set the parameters for the file you want to retrieve
    const params = {
      Bucket: 'jack-preacher-images',
      Key: fileName
    };
    console.log('This is the file name' + fileName);
    // Retrieve the file from S3
    const data = await s3.getObject(params).promise();

    // Ensure data.Body exists
    if (!data?.Body) {
      return NextResponse.json({ message: 'File not found or empty' }, { status: 404 });
    }

    // Determine the content type from the S3 file metadata
    const contentType = data.ContentType || 'image/jpeg';
    // Convert data.Body to Buffer if it isn't already
    // Convert data.Body to Buffer depending on its type
    let buffer;
    if (Buffer.isBuffer(data.Body)) {
      buffer = data.Body;
    } else if (typeof data.Body === 'string') {
      buffer = Buffer.from(data.Body, 'utf-8');
    } else if (data.Body instanceof Uint8Array) {
      buffer = Buffer.from(data.Body);
    } else if (data.Body instanceof Readable) {
      buffer = await streamToBuffer(data.Body);
    } else {
      return NextResponse.json({ message: 'Unsupported file type' }, { status: 500 });
    }
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`
      }
    });
  } catch (error) {
    console.error('Error retrieving file:', error);

    // Return an error response
    return NextResponse.json({ message: 'Error retrieving file' }, { status: 500 });
  }
}

// Helper function to convert Readable stream to Buffer
function streamToBuffer(stream: any) {
  return new Promise((resolve, reject) => {
    const chunks: any = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
