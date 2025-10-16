import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppWebhookPayload {
  From: string;
  Body: string;
  MessageSid: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received WhatsApp vote webhook');
    
    const formData = await req.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    const messageSid = formData.get('MessageSid') as string;

    console.log('WhatsApp from:', from, 'Body:', body, 'MessageSid:', messageSid);

    if (!from || !body) {
      return new Response('Invalid request', { status: 400, headers: corsHeaders });
    }

    // Parse the message - expected format: "VOTE [Store Name] [City]"
    const match = body.trim().match(/^VOTE\s+(.+?)(?:\s+([A-Za-z\s]+))?$/i);
    
    if (!match) {
      const responseMessage = `Invalid format. Please send: VOTE [Store Name] [City]\n\nExample: VOTE Michaels Chicago`;
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${responseMessage}</Message></Response>`,
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
        }
      );
    }

    const storeName = match[1].trim();
    const city = match[2]?.trim();

    console.log('Parsed - Store:', storeName, 'City:', city);

    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Search for the store
    let query = supabase
      .from('stores')
      .select('ShopID, shop_name, shop_city, shop_state')
      .eq('approved', true)
      .ilike('shop_name', `%${storeName}%`);

    if (city) {
      query = query.ilike('shop_city', `%${city}%`);
    }

    const { data: stores, error: searchError } = await query.limit(5);

    if (searchError) {
      console.error('Store search error:', searchError);
      throw searchError;
    }

    if (!stores || stores.length === 0) {
      const responseMessage = `Sorry, we couldn't find a store matching "${storeName}"${city ? ` in ${city}` : ''}. Please check the spelling and try again.`;
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${responseMessage}</Message></Response>`,
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
        }
      );
    }

    if (stores.length > 1 && !city) {
      const storeList = stores.slice(0, 3).map(s => `${s.shop_name} in ${s.shop_city}, ${s.shop_state}`).join('\n');
      const responseMessage = `Multiple stores found. Please specify the city:\n\n${storeList}\n\nExample: VOTE ${storeName} ${stores[0].shop_city}`;
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${responseMessage}</Message></Response>`,
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
        }
      );
    }

    const store = stores[0];

    // Check if this phone number has already voted for this store
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('voter_phone', from)
      .eq('store_id', store.ShopID)
      .maybeSingle();

    if (existingVote) {
      const responseMessage = `You've already voted for ${store.shop_name}! Thank you for your support. Vote for other stores to increase your chances of winning! 🎉`;
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${responseMessage}</Message></Response>`,
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
        }
      );
    }

    // Create a temporary user ID based on phone number for tracking
    const tempUserId = crypto.randomUUID();

    // Record the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        user_id: tempUserId,
        store_id: store.ShopID,
        voter_phone: from,
        rating: 5,
        voting_method: 'whatsapp',
        sms_consent: true,
      });

    if (voteError) {
      console.error('Vote insertion error:', voteError);
      throw voteError;
    }

    console.log('WhatsApp vote recorded successfully for store:', store.shop_name);

    const responseMessage = `✅ Vote recorded for ${store.shop_name} in ${store.shop_city}, ${store.shop_state}!\n\nYou've been entered into our prize draw. Good luck! 🎁\n\nVote for more stores to increase your chances!`;
    
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${responseMessage}</Message></Response>`,
      { 
        status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
      }
    );

  } catch (error: any) {
    console.error('Error processing WhatsApp vote:', error);
    
    const errorMessage = 'Sorry, there was an error processing your vote. Please try again later or vote online at craftretailchampions.com';
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${errorMessage}</Message></Response>`,
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
      }
    );
  }
});
