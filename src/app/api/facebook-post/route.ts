// pages/api/facebook-post.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const FACEBOOK_GRAPH_API_URL = 'https://graph.facebook.com/v20.0/page_id/feed';

const postToFacebook = async (req: NextApiRequest, res: NextApiResponse) => {
  // Your Facebook Page Access Token
  const accessToken = 'YOUR_ACCESS_TOKEN';
  //User Token: EAAOWAzyu8HkBO7epZBlBNfbxg4JWf5yTvQdOTl5SCDiU07aFbJMZBNByOWBfWbLeN9zO4vrn4E4DWI8bOEfe24sDQqZAz6J3tRND3YxQlAWYDPKZAZB7gwWCfr35FgMKXJL7gaPIs0nw9aT6ZCVdhHFvXJFa7FfNS5ioPRaZCWlz8p5NcgJe5CwOpwZD
  //App Token:   1009365577298041|T3yT83Mq41gDj4eW-kzDCc0e2V0
  try {
    const response = await axios.post(
      FACEBOOK_GRAPH_API_URL,
      {
        message: req.body.message,
        link: req.body.link,
        published: req.body.published,
        scheduled_publish_time: req.body.scheduled_publish_time,
        access_token: accessToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error posting to Facebook:', error);
    res.status(500).json({ error: 'Failed to post to Facebook' });
  }
};

export default postToFacebook;
