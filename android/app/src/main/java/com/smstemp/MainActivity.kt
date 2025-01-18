//MainActivity.kt
package com.smstemp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import android.content.Intent
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log
import com.facebook.react.bridge.WritableNativeMap
import android.content.BroadcastReceiver
import android.content.Context
import android.content.IntentFilter

class MainActivity : ReactActivity() {
    private var transactionReceiver: BroadcastReceiver? = null

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "smstemp"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleIntent(intent)
        
        // Create the broadcast receiver
        transactionReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (intent?.action == "onTransactionLogged") {
                    try {
                        val transactionData = intent.getStringExtra("transaction_data")
                        Log.d("MainActivity", "Received transaction data: $transactionData")
                        
                        // Get React context and ensure it's not null
                        val reactContext = reactInstanceManager?.currentReactContext
                        if (reactContext != null) {
                            // Create a map for better data handling
                            val eventMap = WritableNativeMap().apply {
                                putString("data", transactionData)
                            }
                            
                            reactContext
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                                ?.emit("onTransactionLogged", eventMap)
                            Log.d("MainActivity", "Successfully emitted event to RN with data: $transactionData")
                        } else {
                            Log.e("MainActivity", "React context is null")
                        }
                    } catch (e: Exception) {
                        Log.e("MainActivity", "Error forwarding transaction: ${e.message}", e)
                    }
                }
            }
        }

        // Register the receiver
        try {
            val filter = IntentFilter("onTransactionLogged")
            registerReceiver(transactionReceiver, filter)
            Log.d("MainActivity", "Transaction receiver registered")
        } catch (e: Exception) {
            Log.e("MainActivity", "Error registering receiver: ${e.message}")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        // Unregister the receiver
        try {
            transactionReceiver?.let {
                unregisterReceiver(it)
                transactionReceiver = null
                Log.d("MainActivity", "Transaction receiver unregistered")
            }
        } catch (e: Exception) {
            Log.e("MainActivity", "Error unregistering receiver: ${e.message}")
        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        if (intent?.action == "EDIT_TRANSACTION") {
            val amount = intent.getStringExtra("amount") ?: ""
            val type = intent.getStringExtra("type") ?: ""
            val sender = intent.getStringExtra("sender") ?: ""
            val message = intent.getStringExtra("message") ?: ""
            
            try {
                // Send event to React Native
                val eventData = WritableNativeMap().apply {
                    putString("amount", amount)
                    putString("type", type)
                    putString("sender", sender)
                    putString("message", message)
                    putBoolean("fromNotification", true)
                }

                // Emit event to React Native
                reactInstanceManager?.currentReactContext
                    ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    ?.emit("openTransactionEdit", eventData)

                Log.d("MainActivity", "Sent transaction edit event to RN: $eventData")
            } catch (e: Exception) {
                Log.e("MainActivity", "Error sending edit event: ${e.message}")
            }
        }
    }
}
