import { OpenAIService } from '../../../services/ai/openai.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenAIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCaption', () => {
    it('should generate a caption with specified parameters', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Generated test caption #awesome'
              }
            }
          ]
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const caption = await OpenAIService.generateCaption({
        content: 'Test content',
        platform: 'twitter',
        tone: 'professional',
        length: 'medium'
      });

      expect(caption).toBe('Generated test caption #awesome');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.any(Object),
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        OpenAIService.generateCaption({
          content: 'Test content',
          platform: 'twitter',
          tone: 'professional',
          length: 'medium'
        })
      ).rejects.toThrow('Failed to generate caption');
    });
  });
});
