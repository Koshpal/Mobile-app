package com.smstemp

import android.util.Log

object BankSmsUtils {
    // Bank sender patterns
    private val BANK_SENDERS = listOf(
        "HDFCBK", "SBIINB", "ICICIB", "AXISBK", "KOTAK", "PNBSMS",
        "SCBANK", "BOIIND", "CANBNK", "UNIONB", "CENTBK", "BOBIBN",
        "IDBIBK", "YESBNK", "INDBNK", "EQUITAS"
    ).map { it.lowercase() }

    // Transaction keywords
    private val BANK_KEYWORDS = listOf(
        "credited", "debited", "account", "acct", "transaction",
        "transfer", "balance", "upi", "neft", "rtgs", "imps",
        "withdrawal", "deposit", "atm", "credit card", "debit card",
        "a/c", "bank", "payment", "spent", "received", "sent"
    ).map { it.lowercase() }

    // Bank sender patterns as regex
    private val BANK_SENDER_PATTERNS = listOf(
        Regex("^[A-Z]{2}-[A-Z]+BANK", RegexOption.IGNORE_CASE),     // e.g., AD-SBIBANK
        Regex("^[A-Z]{2}-[A-Z]{3,6}", RegexOption.IGNORE_CASE),     // e.g., VM-HDFC
        Regex("^(?!SPAM)[A-Z]{2,6}-\\d{1,6}$", RegexOption.IGNORE_CASE),  // e.g., HDFC-123
        Regex("^[A-Z]{2,6}\\d{6}$", RegexOption.IGNORE_CASE),       // e.g., HDFC000123
        Regex("^[A-Z]{2,6}-[A-Z]{2,6}$", RegexOption.IGNORE_CASE)   // e.g., SBI-BANK
    )

    // Amount pattern regex
    private val AMOUNT_PATTERN = Regex("(?:(?:rs|inr|₹)\\s*\\.?\\s*[,\\d]+(?:\\.\\d{2})?)", RegexOption.IGNORE_CASE)

    data class TransactionInfo(
        val amount: String,
        val type: String,
        val rawMessage: String
    )

    fun isBankSMS(message: String, sender: String): Boolean {
        try {
            val senderLower = sender.lowercase()
            val messageLower = message.lowercase()

            // Log the message being checked
            Log.d("BankSmsUtils", "Checking message from: $sender")

            // Check if sender matches any bank pattern
            val isBankSender = BANK_SENDER_PATTERNS.any { pattern ->
                pattern.matches(sender)
            }

            // Check if sender contains any bank name
            val containsBankName = BANK_SENDERS.any { bankSender ->
                senderLower.contains(bankSender)
            }

            // Check for transaction keywords
            val containsKeywords = BANK_KEYWORDS.any { keyword ->
                messageLower.contains(keyword)
            }

            // Check for amount pattern
            val containsAmount = AMOUNT_PATTERN.find(message) != null

            // Determine if it's a bank SMS
            val isBankMessage = (isBankSender || containsBankName) && 
                              (containsKeywords || containsAmount)

            // Log the result
            Log.d("BankSmsUtils", """
                SMS Analysis:
                Sender: $sender
                Is Bank Sender: $isBankSender
                Contains Bank Name: $containsBankName
                Contains Keywords: $containsKeywords
                Contains Amount: $containsAmount
                Is Bank Message: $isBankMessage
            """.trimIndent())

            return isBankMessage

        } catch (e: Exception) {
            Log.e("BankSmsUtils", "Error analyzing SMS: ${e.message}")
            return false
        }
    }

    fun extractAmount(message: String): String? {
        try {
            val amountMatch = AMOUNT_PATTERN.find(message)
            return amountMatch?.value
        } catch (e: Exception) {
            Log.e("BankSmsUtils", "Error extracting amount: ${e.message}")
            return null
        }
    }

    fun extractTransactionInfo(message: String): TransactionInfo? {
        try {
            val messageLower = message.lowercase()
            
            // Extract amount
            val amount = AMOUNT_PATTERN.find(message)?.value ?: return null

            // Determine transaction type
            val type = when {
                messageLower.contains("credited") || 
                messageLower.contains("received") || 
                messageLower.contains("deposit") -> "credited"
                
                messageLower.contains("debited") || 
                messageLower.contains("spent") || 
                messageLower.contains("sent") || 
                messageLower.contains("withdrawal") -> "debited"
                
                else -> "unknown"
            }

            return TransactionInfo(
                amount = amount,
                type = type,
                rawMessage = message
            )
        } catch (e: Exception) {
            Log.e("BankSmsUtils", "Error extracting transaction info: ${e.message}")
            return null
        }
    }
}