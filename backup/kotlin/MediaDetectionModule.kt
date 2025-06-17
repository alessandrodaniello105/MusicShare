package com.musicshare.app

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.content.Intent
import android.provider.Settings
import android.util.Log

class MediaDetectionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val TAG = "MediaDetectionModule"

    override fun getName(): String {
        return "MediaDetectionModule"
    }

    @ReactMethod
    fun isNotificationServiceEnabled(promise: Promise) {
        try {
            val enabled = isNotificationServiceEnabled()
            Log.d(TAG, "Notification service enabled: $enabled")
            promise.resolve(enabled)
        } catch (e: Exception) {
            Log.e(TAG, "Error checking notification service", e)
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun startMonitoring(promise: Promise) {
        try {
            // Check if notification access is enabled
            val enabled = isNotificationServiceEnabled()
            if (!enabled) {
                // Open notification access settings
                val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(intent)
                promise.reject("NOTIFICATION_ACCESS_REQUIRED", "Please enable notification access for Music Share")
                return
            }

            // Start the notification listener service
            val intent = Intent(reactApplicationContext, MusicShareNotificationListenerService::class.java)
            reactApplicationContext.startService(intent)
            
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error starting monitoring", e)
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopMonitoring(promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, MusicShareNotificationListenerService::class.java)
            reactApplicationContext.stopService(intent)
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping monitoring", e)
            promise.reject("ERROR", e.message)
        }
    }

    private fun isNotificationServiceEnabled(): Boolean {
        val pkgName = reactApplicationContext.packageName
        val flat = Settings.Secure.getString(
            reactApplicationContext.contentResolver,
            "enabled_notification_listeners"
        )
        return flat?.contains(pkgName) == true
    }

    fun sendEvent(eventName: String, params: Any?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
} 