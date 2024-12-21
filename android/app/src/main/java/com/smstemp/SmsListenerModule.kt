//SmsListenerModule.kt
package com.smstemp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.provider.Telephony
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class SmsListenerModule(private val reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    private var smsReceiver: BroadcastReceiver? = null

    override fun getName(): String = "SmsListenerModule"

    private fun sendEvent(eventName: String, message: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, message)
    }

    @ReactMethod
    fun startBackgroundService() {
        try {
            val serviceIntent = Intent(reactContext, SmsBackgroundService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(serviceIntent)
            } else {
                reactContext.startService(serviceIntent)
            }
            Log.d("SmsListenerModule", "Background service started")
        } catch (e: Exception) {
            Log.e("SmsListenerModule", "Error starting service: ${e.message}")
            e.printStackTrace()
        }
    }

    private fun registerSMSReceiver() {
        if (smsReceiver != null) return

        smsReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                        for (sms in Telephony.Sms.Intents.getMessagesFromIntent(intent)) {
                            val params = Arguments.createMap().apply {
                                putString("messageBody", sms.displayMessageBody)
                                putString("senderPhoneNumber", sms.originatingAddress)
                                putDouble("timestamp", sms.timestampMillis.toDouble())
                            }
                            sendEvent("onSMSReceived", params.toString())
                        }
                    }
                } catch (e: Exception) {
                    Log.e("SmsListenerModule", "Error processing SMS: ${e.message}")
                }
            }
        }

        val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
        reactContext.registerReceiver(smsReceiver, filter)
    }

    override fun initialize() {
        super.initialize()
        registerSMSReceiver()
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        smsReceiver?.let {
            reactContext.unregisterReceiver(it)
            smsReceiver = null
        }
    }
}