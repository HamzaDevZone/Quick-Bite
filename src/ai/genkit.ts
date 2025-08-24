
'use server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase';
import {googleCloud} from '@genkit-ai/google-cloud';
import {dotprompt} from '@genkit-ai/dotprompt';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    firebase(),
    googleCloud(),
    dotprompt({
      promptDir: 'src/prompts',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
