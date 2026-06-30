import { NextResponse } from 'next/server';
import { getPublicReviews, submitReview } from '@/lib/reviews';

export async function GET() {
  try {
    const reviews = await getPublicReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, customerName, rating, comment } = body;

    if (!orderId || !customerName || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const review = await submitReview({ orderId, customerName, rating, comment });
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err) {
    console.error('Failed to submit review:', err);
    
    const statusMap = {
      'Invalid Order ID': 404,
      'Only paid orders can be reviewed': 400,
      'You can review your order after it is marked delivered': 400,
      'Reviewer name must match the order name': 400,
      'Please choose a valid rating': 400,
      'Please share a slightly longer review': 400,
      'A review has already been submitted for this order': 409,
    };

    const status = statusMap[err.message] || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
