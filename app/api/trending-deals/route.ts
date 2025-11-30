import { NextResponse } from 'next/server';
import { getMobileCollectionItems } from '@/lib/firebase-collections';

export async function GET() {
    try {
        // Fetch trending deals using the existing helper function
        // We can pass a limit, defaulting to 6 as per the component's usage
        const deals = await getMobileCollectionItems(6);

        return NextResponse.json(deals);
    } catch (error) {
        console.error('Error fetching trending deals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch trending deals' },
            { status: 500 }
        );
    }
}
