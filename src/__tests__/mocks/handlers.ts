import { rest } from 'msw';

export const handlers = [
  rest.post('https://api.twitter.com/oauth2/token', (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: 'mock_access_token',
        token_type: 'bearer'
      })
    );
  }),
  rest.post('https://api.openai.com/v1/chat/completions', (req, res, ctx) => {
    return res(
      ctx.json({
        choices: [{ message: { content: 'Generated caption' } }]
      })
    );
  })
];
