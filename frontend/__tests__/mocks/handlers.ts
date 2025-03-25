import { rest, RestRequest, RestContext } from 'msw';

export const handlers = [
  // Mock post list endpoint
  rest.get('/apidjango/posts', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'Test Post',
          content: 'Test content',
          category: 'technology',
          author: 'test@example.com'
        }
      ])
    );
  }),

  // Mock create post endpoint
  rest.post('/apidjango/posts', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 2,
        ...req.body,
        author: 'test@example.com'
      })
    );
  }),

  // Mock transcription endpoint
  rest.post('/apidjango/transcricoes', (req: RestRequest, res: any, ctx: RestContext) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '1',
        text: 'Test transcription',
        userId: 'test@example.com'
      })
    );
  }),

  // Mock generate post endpoint
  rest.post('/apidjango/gerar-post', (req: RestRequest, res: any, ctx: RestContext) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        title: 'Generated Post',
        content: 'AI generated content',
        slug: 'generated-post'
      })
    );
  })
]; 