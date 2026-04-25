-- Profiles Table
-- Stores user data mapped 1:1 with Supabase Auth
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_id TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    usdc_balance NUMERIC(18, 4) DEFAULT 0.000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for privacy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only select their own profile
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);


-- Transactions Table
-- Stores a ledger of on-chain executions and AI research operations
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tx_hash TEXT NOT NULL,
    query_text TEXT,
    ai_response TEXT,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own transactions
CREATE POLICY "Users can select own transactions" 
    ON transactions FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can only insert transactions into their own ledger
CREATE POLICY "Users can insert own transactions" 
    ON transactions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Example Index for fast queries by user
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- Api keys Table
-- Contains Circle and Mistral AI keys.
-- SECURITY WARNING: RLS enabled with no policies strictly prohibits 
-- client-side access, protecting keys from accidental leakage.
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_api_key TEXT NOT NULL,
    mistral_ai_key TEXT NOT NULL,
    circle_entity_secret TEXT,
    wallet_set_id TEXT,
    agent_wallet_id TEXT,
    agent_wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create no policies: ensuring no access from frontend
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;


