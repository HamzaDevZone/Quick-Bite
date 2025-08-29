
'use server';
import type { Product } from '@/lib/types';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import https from 'https';

async function sendNotification(token: string) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const accessToken = process.env.FCM_ACCESS_TOKEN; 

    if (!accessToken) {
        console.error('FCM_ACCESS_TOKEN is not set in environment variables. Notification will not be sent.');
        // In a real app, you might want to throw an error or handle this more gracefully.
        // For this demo, we will just log the error and stop.
        return;
    }
     if (!projectId) {
        console.error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set in environment variables. Notification will not be sent.');
        return;
    }

    const options = {
        hostname: 'fcm.googleapis.com',
        path: `/v1/projects/${projectId}/messages:send`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    const message = {
        message: {
            token: token,
            notification: {
                title: 'Test Notification',
                body: 'This is a test notification from the admin panel!'
            }
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (d) => {
            data += d;
        });
        res.on('end', () => {
             if (res.statusCode && res.statusCode >= 400) {
                console.error(`Error sending notification to a token. Status: ${res.statusCode}, Response: ${data}`);
            } else {
                console.log(`Successfully sent notification. Response: ${data}`);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Error in FCM request:', error);
    });

    req.write(JSON.stringify(message));
    req.end();
}

export async function sendTestNotification() {
    try {
        const tokensSnapshot = await getDocs(collection(db, 'fcmTokens'));
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token).filter(token => token); // ensure token is not null/undefined

        if (tokens.length === 0) {
             return { success: true, message: 'No subscribed users to send notifications to.' };
        }
        
        console.log(`Attempting to send notifications to ${tokens.length} devices.`);

        // In a real production app, this should be handled by a secure backend service.
        // For demonstration, we're calling it directly.
        await Promise.all(tokens.map(token => sendNotification(token)));
        
        return { success: true, message: `Notification request sent for ${tokens.length} devices. Check server logs for status.` };
    } catch (error: any) {
        console.error('Error sending test notification:', error);
        return { success: false, message: `Failed to send notifications. Error: ${error.message}` };
    }
}
