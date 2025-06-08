package com.smstemp

import android.content.Intent
import android.os.Bundle
import android.widget.*
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import kotlinx.coroutines.*
import java.text.SimpleDateFormat
import java.util.*
import com.smstemp.R

class TransactionEditActivity : AppCompatActivity() {
    
    private val client = OkHttpClient()
    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private val JSON = "application/json; charset=utf-8".toMediaType()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_transaction_edit)

        // Get transaction data from intent
        val amount = intent.getStringExtra("amount") ?: ""
        val type = intent.getStringExtra("type") ?: ""
        val timestamp = intent.getStringExtra("timestamp") ?: ""
        val upiRef = intent.getStringExtra("upiRef") ?: ""
        val phoneNumber = intent.getStringExtra("phoneNumber") ?: ""
        val originalMessage = intent.getStringExtra("originalMessage") ?: ""
        val senderAddress = intent.getStringExtra("senderAddress") ?: ""

        // Set up UI elements
        val amountTextView = findViewById<TextView>(R.id.amountTextView)
        val typeTextView = findViewById<TextView>(R.id.typeTextView)
        val todayDateTextView = findViewById<TextView>(R.id.todayDateTextView)
        val upiRefTextView = findViewById<TextView>(R.id.upiRefTextView)
        val phoneNumberTextView = findViewById<TextView>(R.id.phoneNumberTextView)
        val categorySpinner = findViewById<Spinner>(R.id.categorySpinner)
        val notesEditText = findViewById<EditText>(R.id.notesEditText)
        val addToCashFlowSwitch = findViewById<Switch>(R.id.addToCashFlowSwitch)
        val shareButton = findViewById<Button>(R.id.shareButton)
        val copyButton = findViewById<Button>(R.id.copyButton)
        val saveButton = findViewById<Button>(R.id.saveButton)
        val declineButton = findViewById<Button>(R.id.declineButton)

        // Set transaction details
        amountTextView.text = amount
        typeTextView.text = type
        todayDateTextView.text = formatTimestamp(timestamp)
        upiRefTextView.text = "UPI Ref: $upiRef"
        phoneNumberTextView.text = "Phone: $phoneNumber"

        // Set up category spinner
        val categories = arrayOf("Select Category", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Other")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, categories)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        categorySpinner.adapter = adapter

        // Set up button click listeners
        shareButton.setOnClickListener {
            shareTransactionDetails(amount, type, timestamp, upiRef, phoneNumber)
        }

        copyButton.setOnClickListener {
            copyTransactionDetails(amount, type, timestamp, upiRef, phoneNumber)
        }

        saveButton.setOnClickListener {
            saveTransaction(
                amount = amount,
                type = type,
                timestamp = timestamp,
                upiRef = upiRef,
                phoneNumber = phoneNumber,
                category = categorySpinner.selectedItem.toString(),
                notes = notesEditText.text.toString(),
                addToCashFlow = addToCashFlowSwitch.isChecked,
                originalMessage = originalMessage,
                senderAddress = senderAddress
            )
        }

        declineButton.setOnClickListener {
            finish()
        }
    }

    private fun formatTimestamp(timestamp: String): String {
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            val outputFormat = SimpleDateFormat("MMM dd, yyyy hh:mm a", Locale.getDefault())
            val date = inputFormat.parse(timestamp)
            outputFormat.format(date)
        } catch (e: Exception) {
            timestamp
        }
    }

    private fun shareTransactionDetails(
        amount: String,
        type: String,
        timestamp: String,
        upiRef: String,
        phoneNumber: String
    ) {
        val shareText = """
            Transaction Details:
            Amount: $amount
            Type: $type
            Time: ${formatTimestamp(timestamp)}
            UPI Ref: $upiRef
            Phone: $phoneNumber
        """.trimIndent()

        val shareIntent = Intent(Intent.ACTION_SEND)
        shareIntent.type = "text/plain"
        shareIntent.putExtra(Intent.EXTRA_TEXT, shareText)
        startActivity(Intent.createChooser(shareIntent, "Share Transaction Details"))
    }

    private fun copyTransactionDetails(
        amount: String,
        type: String,
        timestamp: String,
        upiRef: String,
        phoneNumber: String
    ) {
        val copyText = """
            Transaction Details:
            Amount: $amount
            Type: $type
            Time: ${formatTimestamp(timestamp)}
            UPI Ref: $upiRef
            Phone: $phoneNumber
        """.trimIndent()

        val clipboard = getSystemService(CLIPBOARD_SERVICE) as android.content.ClipboardManager
        val clip = android.content.ClipData.newPlainText("Transaction Details", copyText)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(this, "Transaction details copied to clipboard", Toast.LENGTH_SHORT).show()
    }

    private fun saveTransaction(
        amount: String,
        type: String,
        timestamp: String,
        upiRef: String,
        phoneNumber: String,
        category: String,
        notes: String,
        addToCashFlow: Boolean,
        originalMessage: String,
        senderAddress: String
    ) {
        scope.launch {
            try {
                val json = JSONObject().apply {
                    put("amount", amount)
                    put("type", type)
                    put("timestamp", timestamp)
                    put("upiRef", upiRef)
                    put("phoneNumber", phoneNumber)
                    put("paymentMethod", "Online")
                    put("bank", "HDFC")
                    put("category", category)
                    put("description", notes)
                    put("originalMessage", originalMessage)
                    put("senderAddress", senderAddress)
                    put("addToCashFlow", addToCashFlow)
                }

                val request = Request.Builder()
                    .url("https://api.koshpal.tusharsukhwal.com/transaction")
                    .post(json.toString().toRequestBody(JSON))
                    .build()

                withContext(Dispatchers.IO) {
                    val response = client.newCall(request).execute()
                    if (response.isSuccessful) {
                        withContext(Dispatchers.Main) {
                            Toast.makeText(this@TransactionEditActivity, "Transaction saved successfully", Toast.LENGTH_SHORT).show()
                            finish()
                        }
                    } else {
                        withContext(Dispatchers.Main) {
                            Toast.makeText(this@TransactionEditActivity, "Failed to save transaction", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e("TransactionEditActivity", "Error saving transaction", e)
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@TransactionEditActivity, "Error saving transaction", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
} 