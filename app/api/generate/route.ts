import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_LOCAL_FUNCTION_URL =
    'http://127.0.0.1:5001/demo-project/us-central1/api';

function getCandidateUpstreamUrls(): string[] {
    const candidates = [
        process.env.BACKEND_API_URL,
        process.env.BACKEND_API_BASE_URL
            ? `${process.env.BACKEND_API_BASE_URL.replace(/\/$/, '')}/`
            : undefined,
        DEFAULT_LOCAL_FUNCTION_URL,
    ].filter(Boolean) as string[];

    return Array.from(new Set(candidates));
}

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        const urls = getCandidateUpstreamUrls();
        const connectionErrors: Array<{ upstream_url: string; error: string }> = [];
        let lastNonJsonError: {
            upstream_status: number;
            upstream_body_preview: string;
            upstream_url: string;
        } | null = null;

        for (const url of urls) {
            try {
                const upstream = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    cache: 'no-store',
                });

                const text = await upstream.text();

                try {
                    const data = JSON.parse(text);
                    return NextResponse.json(data, { status: upstream.status });
                } catch {
                    lastNonJsonError = {
                        upstream_status: upstream.status,
                        upstream_body_preview: text.slice(0, 500),
                        upstream_url: url,
                    };
                }
            } catch (err) {
                connectionErrors.push({
                    upstream_url: url,
                    error: err instanceof Error ? err.message : 'Unknown fetch error',
                });
            }
        }

        if (lastNonJsonError) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Upstream returned non-JSON response',
                    ...lastNonJsonError,
                    attempted_urls: urls,
                    connection_errors: connectionErrors,
                },
                { status: 502 }
            );
        }

        return NextResponse.json(
            {
                status: 'error',
                message: 'Could not connect to any upstream API URL',
                attempted_urls: urls,
                connection_errors: connectionErrors,
            },
            { status: 502 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                message: 'Failed to process /api/generate request',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
