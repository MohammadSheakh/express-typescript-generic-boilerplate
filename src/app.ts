import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import path from 'path';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFount';
import router from './routes';
import { Morgan } from './shared/morgen';
import i18next from './i18n/i18n'; // Import the i18next configuration
import i18nextMiddleware from 'i18next-express-middleware';

const app = express();

// morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

// body parser
app.use(
  cors({
    origin: [
      'http://localhost:8084',
      'http://localhost:3000',
      'https://rakib7002.sobhoy.com/',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cookie-parser to parse cookies
app.use(cookieParser());

// file retrieve
app.use('/uploads', express.static(path.join(__dirname, '../uploads/')));

// Use i18next middleware
app.use(i18nextMiddleware.handle(i18next));

// router
app.use('/api/v1', router);

// live response
app.get('/test', (req: Request, res: Response) => {
  res.status(201).json({ message: req.t('welcome') });
});

app.get('/test/:lang', (req: Request, res: Response) => {
  const { lang } = req.params;

  // Change the language dynamically for the current request
  i18next.changeLanguage(lang); // Switch language

  console.log(`Current language: ${i18next.language}`); // Log the current language

  // Send the translated response
  res.status(200).json({ message: req.t('welcome') }); // Get translated 'welcome' message
});

// global error handle
app.use(globalErrorHandler);

// handle not found route
app.use(notFound);

export default app;
