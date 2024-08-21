'use client';
import { FaFacebook, FaFileAlt, FaFileArchive, FaTwitter } from 'react-icons/fa';
import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import axios from 'axios';
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

// OpenAI API key
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>();
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState('');

  const handleEncodeImage = async (imagePath: String) => {
    try {
      const response = await fetch('/api/encodeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imagePath: imagePath })
      });

      // Parse the response body as JSON
      const data = await response.json();
      console.log('API Response:', response);
      //console.log('THIS IS THE DATA', data.base64Image);

      if (data && data.base64Image) {
        setBase64Image(data.base64Image);
        console.log('THIS IS THE DATA', data.base64Image);
      } else {
        console.error('Base64 image string is missing in the response.');
      }
    } catch (error) {
      console.error('Error in handleEncodeImage:', error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmitFacebook = async (e: React.FormEvent<HTMLFormElement>) => {
    //console.log(apiKey);
    e.preventDefault();
    const url = 'https://graph.facebook.com/v20.0/340070072532670/feed';
    const headers = {
      'Content-Type': 'application/json'
    };
    const data = {
      message: prompt,
      url: imagePath,
      published: 'true',
      access_token:
        'EAAOWAzyu8HkBO5dfBBN6sZBCStmC8gcz8UWljuGE9BW1GSvVJe5ysYelosZBFDtmFxKhCNswWGa9Wfb3tntlaLuw9ZA4aoDMoP1PBDqEoRQZBcbKyq9ajns2K4bZBpOAuPsiFOJzFt09U1cD9h3qDy7JERzzTKCgP7ZAPeGFZANAD9mRFUYzfRQRh40OpoS8yvTgZAsUCl3sw42twRCtU84vHwZDZD'
    };

    try {
      const response = await axios.post(url, data, { headers });
      console.log(response.data);
      alert('Successfully posted on facebook.');
    } catch (error: any) {
      console.error('Error calling ChatGPT API:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //console.log(apiKey);
    e.preventDefault();
    // const imagePath = 'public/nails2jpeg.jpeg'; // Adjust the path if needed
    // console.log('Sending imagePath:', imagePath);
    //await handleEncodeImage(imagePath);
    const url = 'https://api.openai.com/v1/chat/completions';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    };

    const data = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: "You are a social media manager for a Nail Salon called Betty's Nail Salon" },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Can you create a social media post for this image of my customers nails' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    };
    if (!file) {
      return;
    }
    try {
      const response = await axios.post(url, data, { headers });
      const result = response.data.choices[0].message.content;
      setResponse(JSON.stringify(result));
      setPrompt(JSON.stringify(result));
      return result;
    } catch (error: any) {
      console.error('Error calling ChatGPT API:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
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
      const imagePath = 'public/uploaded-files/' + file.name; // Adjust the path if needed
      setImagePath(imagePath);
      console.log(imagePath);
      //console.log('Sending imagePath:', imagePath);
      await handleEncodeImage(imagePath);
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
    alert('File uploaded!');
  };
  const onSubmitUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevents any unwanted post request.
    if (!file) return;

    try {
      const data = new FormData();
      data.set('file', file);

      const res = await fetch('/api/upload-s3', {
        method: 'POST',
        body: data
      });
      // handle the error
      const imagePath = 'public/uploaded-files/' + file.name; // Adjust the path if needed
      setImagePath(imagePath);
      console.log(imagePath);
      //console.log('Sending imagePath:', imagePath);
      await handleEncodeImage(imagePath);
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
    alert('File uploaded!');
  };

  return (
    <main className="text-center m-20">
      <h1 className="flex align-left "> Post on your Social Media</h1>
      {/* <FaFileAlt size={100} className="inline-block" /> */}

      {previewUrl && file && (
        <div className="flex justify-center items-center flex-row m-5 p-2 border-2 border-gray-300 rounded">
          <Image width={100} height={100} src={previewUrl} alt="Thumbnail Preview" />
          <div className="grid px-5">
            <h3>File Name: {file?.name}</h3>
            <p>File Size: {(file?.size / 1024).toFixed(2)}</p>
          </div>
        </div>
      )}
      <form onSubmit={onSubmitUpload}>
        <input type="file" name="file" onChange={handleFileChange} />
        <button className="btn hover:bg-blue-200 rounded-2xl" type="submit" value="Upload">
          Upload
        </button>
      </form>
      {/* <div className="flex justify-center ">
        <div>
          <FaFacebook size={50} />
          <button className="btn hover:bg-blue-200 rounded-2xl" type="submit" value="Upload">
            Facebook
          </button>
        </div>
        <div>
          <FaTwitter size={50} />
          <button className="btn hover:bg-blue-200 rounded-2xl" type="submit" value="Upload">
            Twitter
          </button>
        </div>
      </div> */}
      <div className="flex justify-center ">
        <form onSubmit={handleSubmit}>
          <button className="flex align-left m-5 btn hover:bg-blue-200 rounded-2xl" type="submit" value="Upload">
            Generate New Post
          </button>
        </form>
      </div>
      {/* <UploadPhoto /> */}
      <div>
        <h1>Generate Social Media Post</h1>
        <form onSubmit={handleSubmit}>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a prompt..." rows={4} cols={50} />
          <br />
          <button type="submit">Generate Post</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {response && (
          <div className=" text-left rounded border-2 border-black">
            <h2>Generated Post:</h2>
            <p>{response}</p>
            <Image width={400} height={400} src={previewUrl} alt="Thumbnail Preview" />
          </div>
        )}
      </div>
      <div className="flex justify-center ">
        <form onSubmit={handleSubmitFacebook}>
          <button className="flex align-left m-5 btn hover:bg-blue-200 rounded-2xl" type="submit" value="Upload">
            Post to Facebook.
          </button>
        </form>
      </div>
    </main>
  );
}
