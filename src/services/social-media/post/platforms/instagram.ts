import axios from 'axios';
import { AppError } from '../../../../utils/errors/AppError';

export async function publishToInstagram(content: string, mediaUrls: string[], accessToken: string): Promise<void> {
  try {
    if (mediaUrls.length === 0) {
      throw new AppError('Instagram posts require at least one media item', 400);
    }

    const mediaIds = await Promise.all(mediaUrls.map(url => uploadMediaToInstagram(url, accessToken)));
    
    await axios.post(`https://graph.instagram.com/me/media`, {
      caption: content,
      media_type: mediaUrls.length > 1 ? 'CAROUSEL_ALBUM' : 'IMAGE',
      children: mediaUrls.length > 1 ? mediaIds : undefined,
      media_url: mediaUrls.length === 1 ? mediaUrls[0] : undefined
    }, {
      params: { access_token: accessToken }
    });
  } catch (error) {
    throw new AppError('Failed to publish to Instagram', 500);
  }
}

async function uploadMediaToInstagram(mediaUrl: string, accessToken: string): Promise<string> {
  try {
    const uploadResponse = await axios.post('https://graph.instagram.com/me/media', {
      image_url: mediaUrl,
      is_carousel_item: true
    }, {
      params: { access_token: accessToken }
    });
    return uploadResponse.data.id;
  } catch (error) {
    throw new AppError('Failed to upload media to Instagram', 500);
  }
}
