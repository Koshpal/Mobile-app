package com.smstemp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        try {
            if (intent.action == "SMS_RECEIVED_ACTION") {
                val messageJson = intent.getStringExtra("sms_data")
                if (messageJson != null) {
                    // Store message in SharedPreferences
                    val prefs = context.getSharedPreferences("SmsMessages", Context.MODE_PRIVATE)
                    val messagesStr = prefs.getString("messages", "[]") ?: "[]"
                    val messagesArray = JSONArray(messagesStr)
                    messagesArray.put(JSONObject(messageJson))
                    prefs.edit().putString("messages", messagesArray.toString()).commit()

                    // Launch the app
                    val launchIntent = context.packageManager
                        .getLaunchIntentForPackage(context.packageName)
                    launchIntent?.apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
                    context.startActivity(launchIntent)
                }
            }
        } catch (e: Exception) {
            Log.e("SmsReceiver", "Error processing broadcast: ${e.message}")
        }
    }
} 