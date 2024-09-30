import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFile extends Document {
  fileName: string;
  fileData: Buffer;
  fileSize: number;
  contentType: string;
}

const FileSchema: Schema<IFile> = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileData: {
    type: Buffer,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  contentType: {
    type: String,
    required: true
  }
});

const File: Model<IFile> = mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default File;
