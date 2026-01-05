import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file received.' },
                { status: 400 }
            );
        }

        // In a real application, you might validate the file type again here
        // for security purposes.

        const webhookUrl = process.env.WEBHOOK_URL;

        if (!webhookUrl) {
            console.warn('WEBHOOK_URL is not defined in environment variables.');
            // For demonstration, we'll successfuly return even if webhook is missing,
            // but log a warning. In production, this might be an error.
            return NextResponse.json({
                message: 'File uploaded (Webhook URL missing, so skipped forwarding)',
                filename: file.name,
                size: file.size,
            });
        }

        console.log(`[Upload Trace] Webhook URL: ${webhookUrl}`);

        // Forward the file to the webhook
        const webhookFormData = new FormData();
        webhookFormData.append('file', file);

        console.log(`[Upload Trace] Forwarding file: ${file.name} (${file.size} bytes)`);

        try {
            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                body: webhookFormData,
            });

            console.log(`[Upload Trace] Webhook Response Status: ${webhookResponse.status}`);

            if (!webhookResponse.ok) {
                const errorText = await webhookResponse.text();
                console.error(
                    `[Upload Trace] Webhook call failed: ${webhookResponse.status} ${webhookResponse.statusText}`
                );
                console.error(`[Upload Trace] Response body: ${errorText}`);

                return NextResponse.json(
                    { error: 'Failed to forward file to webhook', details: errorText },
                    { status: 502 }
                );
            }

            console.log('[Upload Trace] Webhook success');
        } catch (webhookError) {
            console.error('[Upload Trace] Webhook fetch error:', webhookError);
            return NextResponse.json(
                { error: 'Network error calling webhook' },
                { status: 502 }
            );
        }

        return NextResponse.json({
            message: 'File uploaded and forwarded to webhook successfully',
            filename: file.name,
            size: file.size,
        });
    } catch (error) {
        console.error('Upload route error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
