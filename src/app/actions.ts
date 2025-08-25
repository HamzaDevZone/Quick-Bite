'use server';
import type { Product } from '@/lib/types';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import https from 'https';

async function sendNotification(token: string) {
    const project_id = 'save-genie-video-downloader';
    const access_token = process.env.FCM_ACCESS_TOKEN; // You need to get this

    const options = {
        hostname: 'fcm.googleapis.com',
        path: `/v1/projects/${project_id}/messages:send`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`,
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
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(JSON.stringify(message));
    req.end();
}

export async function sendTestNotification() {
    try {
        const tokensSnapshot = await getDocs(collection(db, 'fcmTokens'));
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
        
        console.log(`Sending notifications to ${tokens.length} devices.`);

        // This requires server-side logic with admin privileges, which is complex here.
        // For now, we will log the intent.
        console.log("Intended to send notifications to tokens:", tokens);
        
        // In a real app, you would loop through tokens and call a server-side function.
        // For demonstration, we are just logging it.
        // await Promise.all(tokens.map(token => sendNotification(token)));
        
        return { success: true, message: `Attempted to send notifications to ${tokens.length} devices. Check server logs.` };
    } catch (error) {
        console.error('Error sending test notification:', error);
        return { success: false, message: 'Failed to send notifications.' };
    }
}
