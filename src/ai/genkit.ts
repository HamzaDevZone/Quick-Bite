
'use server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase';
import {googleCloud} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    firebase(),
    googleCloud(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
