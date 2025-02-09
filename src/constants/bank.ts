// Change this to the actual IP address of the machine
export const machine_local_ip = '192.168.0.104';

// keywords to identify bank messages
export const BANK_KEYWORDS = [
  'credited',
  'debited',
  'spent',
  'withdrawn',
  'deposited',
  'transfer',
  'balance',
  'a/c',
  'acct',
  'account',
  'transaction',
  'payment',
  'upi',
  'neft',
  'imps',
  'rtgs',
];

// bank names to identify bank messages
export const BANK_NAMES = [
  'sbi',
  'hdfc',
  'icici',
  'axis',
  'kotak',
  'pnb',
  'rbl',
  'canara',
  'bob',
  'boi',
  'federal',
  'idbi',
  'indian bank',
  'indusind',
  'yes bank',
];

export const BANK_SENDER_PATTERNS = [
  /^[A-Z]{2}-[A-Z]+BANK/i, // e.g., AD-SBIBANK
  /^[A-Z]{2}-[A-Z]{3,6}/i, // e.g., VM-HDFC
  /^(?!SPAM)[A-Z]{2,6}-\d{1,6}$/i, // e.g., HDFC-123, but not SPAM-123
  /^[A-Z]{2,6}\d{6}$/i, // e.g., HDFC000123
  /^[A-Z]{2,6}-[A-Z]{2,6}$/i, // e.g., SBI-BANK
];

export const isBankSMS = (message: string, sender: string): boolean => {
  // Convert message to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();

  // First check if the sender matches bank patterns
  const isBankSender = BANK_SENDER_PATTERNS.some(pattern =>
    pattern.test(sender),
  );

  // Check if the sender contains any bank name
  const containsBankName = BANK_NAMES.some(bank =>
    sender.toLowerCase().includes(bank.toLowerCase()),
  );

  // Check if message contains transaction-related keywords
  const containsTransactionKeywords = BANK_KEYWORDS.some(keyword =>
    lowerMessage.includes(keyword.toLowerCase()),
  );

  // Check if message contains amount patterns (₹ or INR followed by numbers)
  // const containsAmountPattern = /(?:(?:rs|inr|₹)\s*\.?\s*[,\d]+(?:\.\d{2})?)/i.test(message);

  // Message should have either:
  // 1. A bank sender pattern AND (transaction keywords OR amount pattern)
  // 2. A known bank name in sender AND (transaction keywords OR amount pattern)
  return (isBankSender || containsBankName) && containsTransactionKeywords;
};

// function to extract amount from message
export const extractAmount = (message: string): string | null => {
  const amountMatch = message.match(
    /(?:(?:rs|inr|₹)\s*\.?\s*[,\d]+(?:\.\d{2})?)/i,
  );
  return amountMatch ? amountMatch[0] : null;
};
