package com.smstemp

import android.os.Bundle
import android.widget.EditText
import android.widget.TextView
import android.widget.Spinner
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.Toast
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import kotlinx.coroutines.*

class TransactionEditActivity : AppCompatActivity() {
    
    private val client = OkHttpClient()
    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private val JSON = "application/json; charset=utf-8".toMediaType()
    
    private val categories = listOf(
        "Food & Dining",
        "Shopping",
        "Transportation",
        "Entertainment",
        "Bills & Utilities",
        "Health & Medical",
        "Travel",
        "Education",
        "Groceries",
        "Investment",
        "Salary",
        "Other Income",
        "Other Expenses"
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_transaction_edit)

        // Get data from intent
        val amount = intent.getStringExtra("amount") ?: ""
        val type = intent.getStringExtra("type") ?: ""
        val message = intent.getStringExtra("message") ?: ""
        val notificationId = intent.getIntExtra("notification_id", -1)

        // Set up views
        findViewById<TextView>(R.id.amountText).text = amount
        findViewById<TextView>(R.id.typeText).text = type
        findViewById<TextView>(R.id.messageText).text = message

        // Set up category spinner
        val categorySpinner = findViewById<Spinner>(R.id.categorySpinner)
        ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            categories
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            categorySpinner.adapter = adapter
        }

        // Set up description field
        val descriptionEdit = findViewById<EditText>(R.id.descriptionEdit)

        // Set up submit button
        findViewById<Button>(R.id.submitButton).setOnClickListener {
            val selectedCategory = categorySpinner.selectedItem as String
            val description = descriptionEdit.text.toString()

            // Create JSON payload
            val jsonBody = JSONObject().apply {
                put("amount", amount)
                put("type", type)
                put("category", selectedCategory)
                put("description", description)
                put("originalMessage", message)
                put("timestamp", System.currentTimeMillis())
            }

            // Make HTTP request
            scope.launch {
                try {
                    val request = Request.Builder()
                        // Change this to the actual IP address of the machine
                        .url("http://192.168.0.101:8080/printBody")
                        .post(jsonBody.toString().toRequestBody(JSON))
                        .build()

                    withContext(Dispatchers.IO) {
                        client.newCall(request).execute().use { response ->
                            if (response.isSuccessful) {
                                withContext(Dispatchers.Main) {
                                    Toast.makeText(
                                        this@TransactionEditActivity,
                                        "Transaction logged successfully",
                                        Toast.LENGTH_SHORT
                                    ).show()
                                    finish()
                                }
                            } else {
                                throw IOException("Unexpected response ${response.code}")
                            }
                        }
                    }
                } catch (e: Exception) {
                    Log.e("TransactionEdit", "Error sending data: ${e.message}")
                    withContext(Dispatchers.Main) {
                        Toast.makeText(
                            this@TransactionEditActivity,
                            "Error: ${e.message}",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }
            }

            // Log locally as well
            Log.i("TransactionEdit", """
                Transaction Details:
                Amount: $amount
                Type: $type
                Category: $selectedCategory
                Description: $description
                Original Message: $message
            """.trimIndent())
        }

        // Cancel the notification when the screen is opened
        if (notificationId != -1) {
            val notificationManager = getSystemService(NOTIFICATION_SERVICE) as android.app.NotificationManager
            notificationManager.cancel(notificationId)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
} 