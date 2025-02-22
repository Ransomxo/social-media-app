import OpenAI from 'openai';
import { ValidationError } from '../../utils/errors/AppError';
import { config } from '../../config/env';

export type CaptionTone = 'professional' | 'casual' | 'friendly';
export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin';

export interface CaptionGenerationOptions {
  content?: string;
  tone?: CaptionTone;
  platform: SocialPlatform;
  includeHashtags?: boolean;
  maxLength?: number;
}

export interface CaptionGenerationResponse {
  caption: string;
  hashtags?: string[];
}

export class OpenAIService {
  private static readonly openai = new OpenAI({
    apiKey: config.openai.apiKey,
  });

  static async generateCaption(
    options: CaptionGenerationOptions,
  ): Promise<CaptionGenerationResponse> {
    if (!config.openai.apiKey) {
      throw new ValidationError('OpenAI API key is not configured');
    }

    const prompt = this.buildPrompt(options);

    try {
      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional social media manager skilled in creating engaging content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: options.maxLength || config.openai.maxTokens,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new ValidationError('Failed to generate caption: No content received from OpenAI');
      }

      const caption = content.trim();
      const hashtags = options.includeHashtags ? this.extractHashtags(caption) : undefined;

      return {
        caption,
        hashtags
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(
          `Failed to generate caption: ${error.message}`,
        );
      }
      throw new ValidationError('Failed to generate caption');
    }
  }

  private static buildPrompt(options: CaptionGenerationOptions): string {
    const {
      content,
      tone = 'professional',
      platform,
      includeHashtags = true,
    } = options;

    const platformLimits: Record<SocialPlatform, number> = {
      twitter: 280,
      facebook: 63206,
      instagram: 2200,
      linkedin: 3000
    };

    let prompt = `Generate a ${tone} social media post caption`;
    if (content) {
      prompt += ` for the following content: "${content}"`;
    }
    prompt += ` optimized for ${platform} (max ${platformLimits[platform]} characters)`;

    if (includeHashtags) {
      prompt += '. Include relevant hashtags';
      if (platform === 'instagram') {
        prompt += ' (up to 30 hashtags)';
      } else {
        prompt += ' (up to 3 hashtags)';
      }
    }

    prompt += '. The caption should be engaging and encourage interaction.';

    return prompt;
  }

  private static extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    return text.match(hashtagRegex) || [];
  }
}
