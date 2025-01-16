package com.smstemp

import android.util.Log

object BankSmsUtils {
    // Bank sender patterns (common known patterns)
    private val BANK_SENDERS = listOf(
        "HDFCBK", "SBIINB", "ICICIB", "AXISBK", "KOTAK", "PNBSMS",
        "SCBANK", "BOIIND", "CANBNK", "UNIONB", "CENTBK", "BOBIBN",
        "IDBIBK", "YESBNK", "INDBNK", "EQUITAS"
    ).map { it.lowercase() }

    // Transaction-related keywords
    private val BANK_KEYWORDS = listOf(
        "credited", "debited", "account", "acct", "transaction",
        "transfer", "balance", "upi", "neft", "rtgs", "imps",
        "withdrawal", "deposit", "atm", "credit card", "debit card",
        "a/c", "bank", "payment", "spent", "received", "sent"
    ).map { it.lowercase() }

    // Patterns to match sender IDs and SMS formats
    private val BANK_SENDER_PATTERNS = listOf(
        Regex("^[A-Z]{2}-[A-Z]+BANK", RegexOption.IGNORE_CASE),     // e.g., AD-SBIBANK
        Regex("^[A-Z]{2}-[A-Z]{3,6}", RegexOption.IGNORE_CASE),     // e.g., VM-HDFC
        Regex("^(?!SPAM)[A-Z]{2,6}-\\d{1,6}$", RegexOption.IGNORE_CASE),  // e.g., HDFC-123
        Regex("^[A-Z]{2,6}\\d{6}$", RegexOption.IGNORE_CASE),       // e.g., HDFC000123
        Regex("^[A-Z]{2,6}-[A-Z]{2,6}$", RegexOption.IGNORE_CASE)   // e.g., SBI-BANK
    )

    // Regex to detect amounts in SMS
    private val AMOUNT_PATTERN = Regex(
        "(?:(?:rs|inr|₹)\\s*\\.?\\s*[\\d,]+(?:\\.\\d{1,2})?)", RegexOption.IGNORE_CASE
    )

    // Data class to encapsulate transaction details
    data class TransactionInfo(
        val amount: String,
        val type: String,
        val rawMessage: String
    )

    /**
     * Check if a given SMS is likely a bank SMS based on sender and message content.
     */
    fun isBankSMS(message: String, sender: String): Boolean {
        val senderLower = sender.lowercase()
        val messageLower = message.lowercase()

        try {
            // Log details of the message being analyzed
            Log.d("BankSmsUtils", "Analyzing SMS from sender: $sender")

            // Check sender against known patterns or names
            val isBankSender = BANK_SENDER_PATTERNS.any { it.matches(sender) }
            val containsBankName = BANK_SENDERS.any { senderLower.contains(it) }

            // Check message content for keywords or amounts
            val containsKeywords = BANK_KEYWORDS.any { messageLower.contains(it) }
            val containsAmount = AMOUNT_PATTERN.containsMatchIn(message)

            // Determine if it's a bank SMS
            val isBankMessage = (isBankSender || containsBankName) &&
                                (containsKeywords)

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
            Log.e("BankSmsUtils", "Error while analyzing SMS: ${e.message}")
            return false
        }
    }

    /**
     * Extract the amount from the SMS, if present.
     */
    fun extractAmount(message: String): String? {
        return try {
            AMOUNT_PATTERN.find(message)?.value
        } catch (e: Exception) {
            Log.e("BankSmsUtils", "Error extracting amount: ${e.message}")
            null
        }
    }

    /**
     * Extract transaction information (amount and type) from the SMS.
     */
    fun extractTransactionInfo(message: String): TransactionInfo? {
        try {
            val messageLower = message.lowercase()

            // Extract amount
            val amount = extractAmount(message) ?: return null

            // Determine transaction type based on keywords
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