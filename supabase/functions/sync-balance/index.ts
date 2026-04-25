import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Unauthorized Call: Missing Header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: keys } = await supabaseAdmin.from('api_keys').select('*').limit(1).single();
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', user.id).single();
    
    if (!keys || !profile || !profile.wallet_id) throw new Error('Setup incomplete');

    // Ask Circle explicitly what the balance of THIS specific wallet is using native REST fetch
    console.log(`Fetching balance for wallet: ${profile.wallet_id}`);
    const balancesUrl = `https://api.circle.com/v1/w3s/wallets/${profile.wallet_id}/balances`;
    
    const circleResponse = await fetch(balancesUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${keys.circle_api_key}`,
        'Content-Type': 'application/json'
      }
    });

    const body = await circleResponse.json();
    if (!circleResponse.ok) {
       console.error("Circle API Error Body:", body);
       throw new Error(`Circle API Error: ${body.message || JSON.stringify(body)}`);
    }

    // Parse out the USDC balance
    const tokenBalances = body.data?.tokenBalances || [];
    console.log("Token Balances returned:", tokenBalances);
    const usdcData = tokenBalances.find((t: any) => t.token.symbol === 'USDC');
    const realBalance = usdcData ? parseFloat(usdcData.amount) : 0;
    console.log(`Parsed USDC Balance: ${realBalance}`);

    // Save directly to our Ledger
    await supabaseAdmin.from('profiles')
        .update({ usdc_balance: realBalance })
        .eq('id', user.id);

    return new Response(JSON.stringify({ success: true, balance: realBalance }), { 
       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       status: 200 
    });

  } catch (error: any) {
    console.error("SYNC BALANCE FAILURE:", error);
    return new Response(JSON.stringify({ 
        error: error?.message || "Unknown", 
        code: error?.code,
        stack: error?.stack 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
    });
  }
});
