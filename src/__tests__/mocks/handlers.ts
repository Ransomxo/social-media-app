import { rest } from 'msw';

const baseUrl = 'https://api.twitter.com';
const openaiUrl = 'https://api.openai.com';

export const handlers = [
  rest.post(`${baseUrl}/oauth2/token`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock_access_token',
        token_type: 'bearer'
      })
    );
  }),

  rest.post(`${openaiUrl}/v1/chat/completions`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        choices: [{ message: { content: 'Generated caption' } }]
      })
    );
  })
];
