package com.musicshare.app

import android.app.Notification
import android.content.Intent
import android.os.Bundle
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class MusicShareNotificationListenerService : NotificationListenerService() {
    private val TAG = "MusicShareNotificationListenerService"

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "NotificationListenerService created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "NotificationListenerService started")
        return super.onStartCommand(intent, flags, startId)
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName
        Log.d(TAG, "Notification received from package: $packageName")
        
        if (packageName == "com.aspiro.tidal") {
            val notification = sbn.notification
            val extras = notification.extras
            
            val title = extras.getString(Notification.EXTRA_TITLE)
            val text = extras.getString(Notification.EXTRA_TEXT)
            
            Log.d(TAG, "Tidal notification detected - Title: $title, Text: $text")
            
            if (title != null && text != null) {
                // Send event to React Native
                sendEventToReactNative(title, text)
            } else {
                Log.e(TAG, "Missing title or text in Tidal notification")
            }
        }
    }

    private fun sendEventToReactNative(title: String, text: String) {
        try {
            val application = application as MainApplication
            val module = application.reactNativeHost
                .reactInstanceManager
                .currentReactContext
                ?.getNativeModule(MediaDetectionModule::class.java)

            module?.let {
                val params = Arguments.createMap().apply {
                    putString("title", title)
                    putString("text", text)
                }
                it.sendEvent("trackChanged", params)
                Log.d(TAG, "Event sent to React Native: $title - $text")
            } ?: Log.e(TAG, "MediaDetectionModule not found")
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event to React Native", e)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        Log.d(TAG, "Notification removed: ${sbn.packageName}")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "NotificationListenerService destroyed")
    }
} 