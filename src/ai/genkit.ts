
'use server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase';
import {googleCloud} from '@genkit-ai/google-cloud';
import {dotprompt} from '@genkit-ai/dotprompt';

import {prod} from 'firebase-functions/lib/logger';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
      maxOutputTokens: 2048,
    }),
    firebase(),
    googleCloud(),
    dotprompt({
      promptDir: 'src/prompts',
    }),
  ],
  logLevel: prod ? 'warn' : 'debug',
  enableTracingAndMetrics: true,
});
