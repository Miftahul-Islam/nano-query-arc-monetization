export type WalletState = 'disconnected' | 'zero_balance' | 'funded';
export type TxStatus = 'CONFIRMED' | 'PENDING' | 'ERROR';

export interface Transaction {
  id: string;
  hash: string;
  amount: number;
  status: TxStatus;
  timestamp: number;
  type: 'deposit' | 'query';
}

export interface QueryResponse {
  id: string;
  query: string;
  response: string;
  timestamp: number;
  balanceAfter?: number;
}
