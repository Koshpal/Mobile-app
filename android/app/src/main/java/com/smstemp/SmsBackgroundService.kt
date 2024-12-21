package com.smstemp

import android.app.*
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
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
                                    val messageJson = JSONObject().apply {
                                        put("messageBody", sms.displayMessageBody ?: "Unknown message body")
                                        put("senderPhoneNumber", sms.originatingAddress ?: "Unknown sender")
                                        put("timestamp", sms.timestampMillis)
                                    }.toString()

                                    saveMessage(messageJson)
                                    showMessageNotification(
                                        sms.originatingAddress ?: "Unknown sender",
                                        sms.displayMessageBody ?: "No message content"
                                    )
                                }
                            }
                        } catch (e: Exception) {
                            Log.e("SmsBackgroundService", "Error processing SMS: ${e.message}")
                        }
                    }
                }

                val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED").apply {
                    priority = IntentFilter.SYSTEM_HIGH_PRIORITY
                }
                registerReceiver(smsReceiver, filter)
                Log.d("SmsBackgroundService", "SMS receiver registered successfully")
            } catch (e: Exception) {
                Log.e("SmsBackgroundService", "Error registering SMS receiver: ${e.message}")
                throw e
            }
        }
    }

    private fun showMessageNotification(sender: String, message: String) {
        try {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val notificationId = System.currentTimeMillis().toInt()

            val notification = NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("New SMS from $sender")
                .setContentText(message)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .build()

            notificationManager.notify(notificationId, notification)
        } catch (e: Exception) {
            Log.e("SmsBackgroundService", "Error showing message notification: ${e.message}")
        }
    }

    private fun saveMessage(messageJson: String) {
        try {
            val prefs = getSharedPreferences("SmsStorage", Context.MODE_PRIVATE)
            val messagesStr = prefs.getString("messages", "[]") ?: "[]"
            val messagesArray = JSONArray(messagesStr)
            messagesArray.put(JSONObject(messageJson))

            prefs.edit().apply {
                putString("messages", messagesArray.toString())
                apply()
            }
            Log.d("SmsBackgroundService", "Message saved successfully")
        } catch (e: Exception) {
            Log.e("SmsBackgroundService", "Error saving message: ${e.message}")
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