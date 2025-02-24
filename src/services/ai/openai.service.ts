import axios from 'axios';
import { AppError } from '../../utils/errors/AppError';

export interface GenerateCaptionRequest {
  content: string;
  platform: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'humorous';
  length?: 'short' | 'medium' | 'long';
}

export class OpenAIService {
  static async generateCaption(request: GenerateCaptionRequest): Promise<string> {
    try {
      const { content, platform, tone = 'professional', length = 'medium' } = request;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a social media expert who creates engaging captions.'
            },
            {
              role: 'user',
              content: this.buildPrompt(content, platform, tone, length)
            }
          ],
          max_tokens: this.getMaxTokens(length),
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.choices?.[0]?.message?.content) {
        throw new AppError('Invalid response from OpenAI', 500);
      }

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if ((error as { response?: { status: number } }).response?.status === 429) {
        throw new AppError('Rate limit exceeded', 429);
      }
      throw new AppError('Failed to generate caption', 500);
    }
  }

  private static buildPrompt(
    content: string,
    platform: string,
    tone: string,
    length: string
  ): string {
    return `Generate a ${length} ${tone} social media caption for ${platform} based on the following content:

Content: ${content}

The caption should:
- Be engaging and attention-grabbing
- Use appropriate hashtags for ${platform}
- Follow ${platform}'s best practices
- Maintain a ${tone} tone
- Be ${length} in length
- Include emojis where appropriate

Caption:`;
  }

  private static getMaxTokens(length: string): number {
    switch (length) {
      case 'short':
        return 50;
      case 'medium':
        return 100;
      case 'long':
        return 200;
      default:
        return 100;
    }
  }
}
