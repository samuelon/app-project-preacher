import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { imagePath } = await req.json();
    console.log('Received imagePath:', imagePath);

    // Construct the full path to the image file
    const filePath = path.join(process.cwd(), imagePath);
    console.log('Constructed filePath:', filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error('File does not exist at path:', filePath);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the image file
    const imageFile = fs.readFileSync(filePath);

    // Encode the image file to a Base64 string
    const base64Image = Buffer.from(imageFile).toString('base64');

    // Respond with the Base64 string
    return NextResponse.json({ base64Image }, { status: 200 });
  } catch (error) {
    console.error('Error encoding image:', error);
    return NextResponse.json({ error: 'Failed to encode image' }, { status: 500 });
  }
}
