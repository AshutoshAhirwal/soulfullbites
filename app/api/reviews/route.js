import { NextResponse } from 'next/server';
import { getPublicReviews, submitReview } from '@/lib/reviews';
import { checkRateLimit, getClientIp, checkOrigin, sanitizeError } from '@/lib/security';
import { validateText, validateRating } from '@/lib/validation';

export async function GET() {
  try {
    const reviews = await getPublicReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (err) {
    return NextResponse.json({ error: sanitizeError(err, 'reviews-get') }, { status: 500 });
  }
}

export async function POST(request) {
  // Rate limit: 5 review submissions per minute per IP
  const ip = await getClientIp();
  if (!checkRateLimit(`review_${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  // CSRF origin check
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { orderId, customerName, rating, comment } = body;

    // Presence check
    if (!orderId || !customerName || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Length validation
    const orderIdResult  = validateText(orderId, 100);
    const nameResult     = validateText(customerName, 100);
    const commentResult  = validateText(comment, 1000);

    if (!orderIdResult.valid)  return NextResponse.json({ error: 'Invalid order ID.' }, { status: 400 });
    if (!nameResult.valid)     return NextResponse.json({ error: 'Name must be 100 characters or fewer.' }, { status: 400 });
    if (!commentResult.valid)  return NextResponse.json({ error: 'Review must be 1,000 characters or fewer.' }, { status: 400 });

    // Rating must be integer 1–5
    if (!validateRating(rating)) {
      return NextResponse.json({ error: 'Rating must be a whole number between 1 and 5.' }, { status: 400 });
    }

    const review = await submitReview({
      orderId:      orderIdResult.value,
      customerName: nameResult.value,
      rating:       Number(rating),
      comment:      commentResult.value,
    });
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err) {
    const knownErrors = {
      'Invalid Order ID': 404,
      'Only paid orders can be reviewed': 400,
      'You can review your order after it is marked delivered': 400,
      'Reviewer name must match the order name': 400,
      'Please choose a valid rating': 400,
      'Please share a slightly longer review': 400,
      'A review has already been submitted for this order': 409,
    };

    const status = knownErrors[err.message];
    if (status) {
      // Known business logic errors are safe to return directly
      return NextResponse.json({ error: err.message }, { status });
    }

    return NextResponse.json({ error: sanitizeError(err, 'reviews-post') }, { status: 500 });
  }
}
