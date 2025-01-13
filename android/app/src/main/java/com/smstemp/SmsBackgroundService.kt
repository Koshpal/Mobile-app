package com.smstemp

import android.app.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Color
import android.os.Build
import android.os.IBinder
import android.provider.Telephony
import android.util.Log
import androidx.core.app.NotificationCompat
import org.json.JSONArray
import org.json.JSONObject

class SmsBackgroundService : Service() {
    private var smsReceiver: BroadcastReceiver? = null

    companion object {
        private const val NOTIFICATION_ID = 1
        private const val CHANNEL_ID = "SmsListenerChannel"
        private var isServiceRunning = false
    }

    override fun onCreate() {
        super.onCreate()
        try {
            if (!isServiceRunning) {
                createNotificationChannel()
                startInForeground()
                registerSMSReceiver()
                isServiceRunning = true
                Log.d("SmsBackgroundService", "Service created successfully")
            }
        } catch (e: Exception) {
            Log.e("SmsBackgroundService", "Error in onCreate: ${e.message}")
            e.printStackTrace()
            stopSelf()
        }
    }

    private fun startInForeground() {
        try {
            startForeground(NOTIFICATION_ID, createNotification())
            Log.d("SmsBackgroundService", "Started in foreground successfully")
        } catch (e: Exception) {
            Log.e("SmsBackgroundService", "Error starting foreground: ${e.message}")
            throw e
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                val channel = NotificationChannel(
                    CHANNEL_ID,
                    "SMS Listener Service",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Background service for SMS monitoring"
                    setShowBadge(true)
                }

                (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)
                    .createNotificationChannel(channel)
                    
                Log.d("SmsBackgroundService", "Notification channel created successfully")
            } catch (e: Exception) {
                Log.e("SmsBackgroundService", "Error creating notification channel: ${e.message}")
                throw e
            }
        }
    }

    private fun createNotification(): Notification {
        try {
            val pendingIntent = PendingIntent.getActivity(
                this,
                0,
                packageManager.getLaunchIntentForPackage(packageName)?.apply {
                    flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
                },
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
                } else {
                    PendingIntent.FLAG_UPDATE_CURRENT
                }
            )

            return NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("SMS Listener Active")
                .setContentText("Monitoring incoming SMS messages")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(false)
                .setOngoing(true)
                .build()
        } catch (e: Exception) {
            Log.e("SmsBackgroundService", "Error creating notification: ${e.message}")
            throw e
        }
    }

    private fun registerSMSReceiver() {
        if (smsReceiver == null) {
            try {
                smsReceiver = object : BroadcastReceiver() {
                    override fun onReceive(context: Context, intent: Intent) {
                        try {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                                for (sms in Telephony.Sms.Intents.getMessagesFromIntent(intent)) {
                                    val sender = sms.originatingAddress ?: "Unknown sender"
                                    val message = sms.displayMessageBody ?: "No message content"

                                    // First log the received SMS
                                    Log.d("SmsBackgroundService", """
                                        |SMS Received:
                                        |From: $sender
                                        |Message: $message
                                        |-------------------
                                    """.trimMargin())

                                    // Check if it's a bank SMS
                                    if (BankSmsUtils.isBankSMS(message, sender)) {
                                        Log.i("SmsBackgroundService", "Bank SMS detected!")

                                        // Create JSON for bank SMS
                                        val messageJson = JSONObject().apply {
                                            put("messageBody", message)
                                            put("senderPhoneNumber", sender)
                                            put("timestamp", System.currentTimeMillis())
                                        }.toString()

                                        // Show notification for bank SMS
                                        showBankSmsNotification(sender, message)

                                        // Send to React Native via broadcast
                                        Intent("onSMSReceived").also { broadcastIntent ->
                                            broadcastIntent.putExtra("sms_data", messageJson)
                                            sendBroadcast(broadcastIntent)
                                            Log.i("SmsBackgroundService", "Bank SMS broadcast sent: $messageJson")
                                        }

                                        // Save the bank SMS
                                        saveMessage(messageJson)
                                    } else {
                                        Log.d("SmsBackgroundService", "Ignored non-bank SMS")
                                    }
                                }
                            }
                        } catch (e: Exception) {
                            Log.e("SmsBackgroundService", "Error processing SMS", e)
                        }
                    }
                }

                val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
                registerReceiver(smsReceiver, filter)
                Log.i("SmsBackgroundService", "SMS receiver registered successfully")
            } catch (e: Exception) {
                Log.e("SmsBackgroundService", "Error registering SMS receiver", e)
            }
        }
    }

    private fun showBankSmsNotification(sender: String, message: String) {
        try {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            
            // Create notification channel for Android O and above
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    "bank_sms_channel",
                    "Bank SMS Notifications",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Notifications for bank SMS messages"
                    enableLights(true)
                    lightColor = Color.BLUE
                    enableVibration(true)
                }
                notificationManager.createNotificationChannel(channel)
            }

            // Create intent to open app when notification is clicked
            val pendingIntent = PendingIntent.getActivity(
                this,
                0,
                packageManager.getLaunchIntentForPackage(packageName),
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
                } else {
                    PendingIntent.FLAG_UPDATE_CURRENT
                }
            )

            // Build the notification
            val notification = NotificationCompat.Builder(this, "bank_sms_channel")
                .setContentTitle("New Bank SMS from $sender")
                .setContentText(message)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .setStyle(NotificationCompat.BigTextStyle().bigText(message))
                .build()

            // Show the notification
            val notificationId = System.currentTimeMillis().toInt()
            notificationManager.notify(notificationId, notification)
            
            Log.i("SmsBackgroundService", "Bank SMS notification shown")
        } catch (e: Exception) {
            Log.e("SmsBackgroundService", "Error showing notification: ${e.message}")
        }
    }

    private fun saveMessage(messageJson: String) {
        try {
            val prefs = getSharedPreferences("SmsMessages", Context.MODE_PRIVATE)
            val messagesStr = prefs.getString("messages", "[]") ?: "[]"
            val messagesArray = JSONArray(messagesStr)
            messagesArray.put(JSONObject(messageJson))

            prefs.edit().apply {
                putString("messages", messagesArray.toString())
                apply()
            }
            Log.i("SmsBackgroundService", "Bank SMS saved successfully")
        } catch (e: Exception) {
            Log.e("SmsBackgroundService", "Error saving message", e)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (!isServiceRunning) {
            try {
                createNotificationChannel()
                startInForeground()
                registerSMSReceiver()
                isServiceRunning = true
            } catch (e: Exception) {
                Log.e("SmsBackgroundService", "Error in onStartCommand: ${e.message}")
                stopSelf()
                return START_NOT_STICKY
            }
        }
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            smsReceiver?.let {
                unregisterReceiver(it)
                smsReceiver = null
            }
            isServiceRunning = false
            Log.d("SmsBackgroundService", "Service destroyed successfully")
        } catch (e: Exception) {
            Log.e("SmsBackgroundService", "Error in onDestroy: ${e.message}")
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}