'use client';
import { FaFileAlt, FaFileArchive } from 'react-icons/fa';
import { useState } from 'react';

export default function Page() {
  const [file, setFile] = useState<File>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevents any unwanted post request.
    if (!file) return;

    try {
      const data = new FormData();
      data.set('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <main className="text-center">
      <h1>Admin Page</h1>
      <h4 className="mb-20"> Upload File here</h4>
      <FaFileAlt size={200} className="inline-block" />

      <form onSubmit={onSubmit}>
        <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])} />
        <button className="btn hover:bg-blue-200" type="submit" value="Upload">
          Button
        </button>
      </form>
    </main>
  );
}
