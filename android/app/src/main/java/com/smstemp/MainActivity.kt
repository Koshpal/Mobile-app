package com.smstemp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.WritableNativeMap

class MainActivity : ReactActivity() {
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
                    ?.getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    ?.emit("openTransactionEdit", eventData)

                Log.d("MainActivity", "Sent transaction edit event to RN: $eventData")
            } catch (e: Exception) {
                Log.e("MainActivity", "Error sending edit event: ${e.message}")
            }
        }
    }
}
