import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs, updateDoc } from 'firebase/firestore';

// Webhook secret token for security (set this in your environment)
const WEBHOOK_SECRET = process.env.SHIPROCKET_WEBHOOK_SECRET || 'your-secure-webhook-token';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authenticity
    const authHeader = request.headers.get('authorization');
    const providedToken = authHeader?.replace('Bearer ', '');
    
    if (!providedToken || providedToken !== WEBHOOK_SECRET) {
      console.log('Unauthorized webhook attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhookData = await request.json();
    console.log('Shiprocket webhook received:', JSON.stringify(webhookData, null, 2));

    // Extract shipment information
    const {
      order_id,
      shipment_id,
      awb,
      status,
      current_status,
      tracking_url,
      courier_name,
      delivered_date,
      pickup_date,
      shipped_date,
      rto_date,
      expected_delivery_date
    } = webhookData;

    if (!order_id && !shipment_id) {
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
    }

    // Find the order in Firestore using shipment_id or order_id
    let orderRef;
    let orderDoc;

    // Try to find by shipment_id first
    if (shipment_id) {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('shipment.shipment_id', '==', shipment_id.toString()),
        limit(1)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      
      if (!ordersSnapshot.empty) {
        orderDoc = ordersSnapshot.docs[0];
        orderRef = orderDoc.ref;
      }
    }

    // If not found by shipment_id, try by order_id
    if (!orderDoc && order_id) {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('shipment.order_id', '==', order_id.toString()),
        limit(1)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      
      if (!ordersSnapshot.empty) {
        orderDoc = ordersSnapshot.docs[0];
        orderRef = orderDoc.ref;
      }
    }

    if (!orderDoc || !orderRef) {
      console.log(`Order not found for shipment_id: ${shipment_id}, order_id: ${order_id}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      'shipment.status': status || current_status,
      'shipment.updated_at': new Date().toISOString(),
    };

    // Add optional fields if present
    if (awb) updateData['shipment.awb'] = awb;
    if (tracking_url) updateData['shipment.tracking_url'] = tracking_url;
    if (courier_name) updateData['shipment.courier_name'] = courier_name;
    if (delivered_date) updateData['shipment.delivered_date'] = delivered_date;
    if (pickup_date) updateData['shipment.pickup_date'] = pickup_date;
    if (shipped_date) updateData['shipment.shipped_date'] = shipped_date;
    if (rto_date) updateData['shipment.rto_date'] = rto_date;
    if (expected_delivery_date) updateData['shipment.expected_delivery_date'] = expected_delivery_date;

    // Update the order in Firestore
    await updateDoc(orderRef, updateData);

    console.log(`Order ${orderDoc.id} updated with shipment status: ${status || current_status}`);

    // Log important status changes
    const importantStatuses = ['DELIVERED', 'OUT_FOR_DELIVERY', 'SHIPPED', 'RTO', 'LOST', 'DAMAGED'];
    if (importantStatuses.includes(status || current_status)) {
      console.log(`IMPORTANT: Order ${orderDoc.id} status changed to ${status || current_status}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      order_id: orderDoc.id,
      status: status || current_status
    });

  } catch (error) {
    console.error('Shiprocket webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return new Response(challenge, { status: 200 });
  }
  
  return NextResponse.json({ 
    message: 'Shiprocket webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}