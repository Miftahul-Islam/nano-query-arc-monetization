import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { initiateDeveloperControlledWalletsClient, registerEntitySecretCiphertext } from "npm:@circle-fin/developer-controlled-wallets";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

serve(async (req) => {
  // Handle CORS preflight options urgently before anything!
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the User using the JWT token coming from the frontend
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Unauthorized Call: Missing Authorization Header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
        throw new Error('System initialization failed: Edge function environment variables are missing.');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    // In edge functions, we MUST disable session persistence to avoid context leaks
    // and we explicitly pass the token into getUser() rather than relying on global headers.
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError) {
        throw new Error(`Unauthorized Call: Supabase Auth Error: ${authError.message}`);
    }
    if (!user) {
        throw new Error('Unauthorized Call: No user session found');
    }

    // 2. Bypass RLS to access the API keys table securely
    console.log(">> START: Fetching keys from DB")
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: keys, error: keyError } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .limit(1)
      .single();

    if (keyError || !keys) throw new Error('Platform API Keys not configured');
    
    console.log(">> CIRCLE KEY DETECTED:", keys.circle_api_key.substring(0, 15) + "...");

    // 3. Initialize Circle Developer Wallets Client
    const circle = initiateDeveloperControlledWalletsClient({
      apiKey: keys.circle_api_key,
      entitySecret: keys.circle_entity_secret,
    });

    let walletSetId = keys.wallet_set_id;
    
    // Create WalletSet if it doesn't automatically exist
    if (!walletSetId) {
        console.log(">> STEP: Creating Wallet Set (Entity Secret is assumed to be already registered globally)...");
        const setRes = await circle.createWalletSet({ name: "NanoQuery Developers" });
        walletSetId = setRes.data?.walletSet?.id;
        
        if (!walletSetId) {
            throw new Error("Failed to create Wallet Set. Have you registered the Entity Secret locally using Node.js yet?");
        }
        
        await supabaseAdmin.from('api_keys').update({ wallet_set_id: walletSetId }).eq('id', keys.id);
    }

    // 4. Ensure an "Agent Wallet" Exists for receiving platform query fees
    let agentAddress = keys.agent_wallet_address;
    let agentId = keys.agent_wallet_id;
    
    if (!agentAddress) {
        const agentRes = await circle.createWallets({
            blockchains: ['ARC-TESTNET'], 
            count: 1,
            walletSetId: walletSetId
        });
        agentAddress = agentRes.data?.wallets?.[0]?.address;
        agentId = agentRes.data?.wallets?.[0]?.id;
        
        await supabaseAdmin.from('api_keys').update({ 
            agent_wallet_id: agentId, 
            agent_wallet_address: agentAddress 
        }).eq('id', keys.id);
    }

    // 5. Create the new user's wallet automatically
    const userWalletRes = await circle.createWallets({
      blockchains: ['ARC-TESTNET'],
      count: 1,
      walletSetId: walletSetId
    });

    const newWallet = userWalletRes.data?.wallets?.[0];
    if (!newWallet) throw new Error('Failed to generate Circle Wallet');

    // 6. Save the new wallet mapping to the 'profiles' database table
    const { error: insertError } = await supabaseAdmin.from('profiles').upsert({
      id: user.id,
      wallet_id: newWallet.id,
      wallet_address: newWallet.address,
      usdc_balance: 0.000 // New wallet is explicitly initialized at zero
    });

    if (insertError) throw insertError;

    // 7. Return success to the frontend React component
    return new Response(JSON.stringify({ 
       success: true, 
       wallet_address: newWallet.address,
       wallet_id: newWallet.id,
       agent_address: agentAddress,
       wallet_set_id: walletSetId,
       agent_wallet_id: agentId
    }), { 
       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       status: 200 
    });

  } catch (error: any) {
    console.error("DEBUG:", error);
    // Explicitly destructure ONLY the fields we need to prevent Circular JSON errors from SDK network objects
    const safeErrorObj = {
        error: error?.message || 'Unknown error occurred',
        stack: error?.stack,
        code: error?.code // Circle API often includes a numeric code we can pass along
    };
    
    return new Response(JSON.stringify(safeErrorObj), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
