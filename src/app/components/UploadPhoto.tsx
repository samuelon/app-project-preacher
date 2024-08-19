import { useState, ChangeEvent, FormEvent } from 'react';

export default function UploadPhoto() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Example POST request to an API route (uncomment to use)
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    // const result = await response.json();
    // console.log(result);

    alert('File uploaded!');
  };

  return (
    <div>
      <h1>Upload Photo</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {file && (
        <div style={{ marginTop: '20px' }}>
          <h3>File Details:</h3>
          <p>
            <strong>File Name:</strong> {file.name}
          </p>
          <p>
            <strong>File Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {previewUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Thumbnail Preview:</h3>
          <img src={previewUrl} alt="Thumbnail Preview" style={{ width: '200px', height: 'auto' }} />
        </div>
      )}
    </div>
  );
}
