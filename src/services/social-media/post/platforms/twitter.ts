import axios from 'axios';
import { AppError } from '../../../../utils/errors/AppError';

export async function publishToTwitter(content: string, mediaUrls: string[], accessToken: string): Promise<void> {
  try {
    const mediaIds = await Promise.all(mediaUrls.map(url => uploadMediaToTwitter(url, accessToken)));
    
    await axios.post('https://api.twitter.com/2/tweets', {
      text: content,
      ...(mediaIds.length && { media: { media_ids: mediaIds } })
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  } catch (error) {
    throw new AppError('Failed to publish to Twitter', 500);
  }
}

async function uploadMediaToTwitter(mediaUrl: string, accessToken: string): Promise<string> {
  try {
    const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
    const uploadResponse = await axios.post('https://upload.twitter.com/1.1/media/upload.json', {
      media_data: Buffer.from(mediaResponse.data).toString('base64')
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return uploadResponse.data.media_id_string;
  } catch (error) {
    throw new AppError('Failed to upload media to Twitter', 500);
  }
}
