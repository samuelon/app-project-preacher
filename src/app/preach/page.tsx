'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import axios from 'axios';
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

// OpenAI API key
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export default function page() {
  // State to hold the image preview URL
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [stream, setStream] = useState<any | null>(null);
  const [imageID, setImageID] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [prompt, setPrompt] = useState<string | null>();

  // Function to handle file input change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null; // Get the selected file
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      setStream(selectedFile.stream());
      // When the file is read, set the image preview URL
      reader.onload = () => {
        setSuccess('Successfully uploaded');
        //setImageURL(reader.result);
        setImagePreview(reader.result as string);
        setBase64Image((reader.result as string)?.split(',')[1]);
      };

      // Read the image file as a Data URL (Base64 encoded)
      //trigger reload and sets the image.
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //console.log(apiKey);
    e.preventDefault();
    // const imagePath = 'public/nails2jpeg.jpeg'; // Adjust the path if needed
    // console.log('Sending imagePath:', imagePath);
    //await handleEncodeImage(imagePath);

    if (!file) {
      return;
    }

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
                url: `data:${file.type};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    };

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

  const handleSubmitImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(stream);
    const url = 'https://graph.facebook.com/v20.0/340070072532670/photos';
    const headers = {
      'Content-Type': 'application/json'
    };
    const formData = new FormData();
    formData.append('images', base64Image); // 'source' is the field name expected by Facebook
    formData.append(
      'access_token',
      'EAAOWAzyu8HkBO7ZCmUJiiCwr7pIRogyDJ3is2qAmuwtrIl5lKk0chQJ9iXP8GVEIpDqB9MBXCttZBQZCKl9L6NEOZAaxw53aLZAH7VFSBkXxzWXMapXnUW20lbfZAsF3kqcqpoPheGFTYYbKPQjS1ZAim3OZBL5rPp6KinxUpmNrT7VtyKtXvUVwLy0vOQjmY05vCByZBwcs71H506ZAUZD'
    ); // Attach your access token

    try {
      const response = await axios.post(url, formData, { headers });
      console.log(response.data);
      setImageID(response.data);
      alert('Successfully posted on facebook.');
    } catch (error: any) {
      console.error('Error calling Facebook Photo API:', error.response ? error.response.data : error.message);
      throw error;
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
      attached_media: [{ media_fbid: imageID }],
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

  return (
    <div>
      <h1>Upload an Image</h1>
      {/* Input to select an image */}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <br />
      {/* Display the uploaded image */}
      {imagePreview && <img src={imagePreview} alt="Image Preview" style={{ maxWidth: '300px', display: 'block' }} />}
      {success && (
        <h1>
          {success} {imagePreview}
        </h1>
      )}
      <div className="flex justify-center ">
        <form onSubmit={handleSubmit}>
          <button className="flex align-left m-5 btn hover:bg-blue-200 rounded-2xl" type="submit" value="Upload">
            Generate New Post
          </button>
        </form>
      </div>
      <div>
        <h1>Generate Social Media Post</h1>
        <form onSubmit={handleSubmit}>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a prompt..." rows={4} cols={50} />
          <br />
          <button type="submit">Generate Post</button>
        </form>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
        {response && (
          <div className=" text-left rounded border-2 border-black">
            <h2>Generated Post:</h2>
            {/* <p>{response}</p> */}
            {imagePreview && <Image width={400} height={400} src={imagePreview} alt="Thumbnail Preview" />}
          </div>
        )}
      </div>
      handleSubmitImage
      <div className="flex justify-center ">
        <form onSubmit={handleSubmitImage}>
          <button className="flex align-left m-5 btn hover:bg-blue-200 rounded-2xl" type="submit" value="Upload">
            Post Photo to Facebook.
          </button>
        </form>
      </div>
      <div className="flex justify-center ">
        <form onSubmit={handleSubmitFacebook}>
          <button className="flex align-left m-5 btn hover:bg-blue-200 rounded-2xl" type="submit" value="Upload">
            Post to Facebook.
          </button>
        </form>
      </div>
    </div>
  );
}
