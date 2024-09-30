import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import File, { IFile } from '../../../../models/File';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Adjust the limit as necessary
    }
  }
};

type Data = {
  success: boolean;
  message?: string;
  data?: IFile;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { fileName, fileData, fileSize, contentType } = req.body;

      const newFile = new File({
        fileName,
        fileData: Buffer.from(fileData, 'base64'),
        fileSize,
        contentType
      });

      await newFile.save();

      res.status(201).json({ success: true, message: 'File uploaded successfully!', data: newFile });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
// import { writeFile } from 'fs/promises';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   const data = await request.formData();
//   const file: File | null = data.get('file') as unknown as File;

//   if (!file) {
//     return NextResponse.json({ success: false });
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   // With the file data in the buffer, you can do whatever you want with it.
//   // For this, we'll just write it to the filesystem in a new location
//   const path = `./public/uploaded-files/${file.name}`;
//   console.log(path);
//   await writeFile(path, buffer);
//   console.log(`open ${path} to see the uploaded file`);

//   return NextResponse.json({ success: true });
// }
