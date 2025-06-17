const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withCreateJavaFiles(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const androidPath = config.modRequest.platformProjectRoot;
      const javaPath = path.join(androidPath, 'app/src/main/java/com/musicshare/app');
      const manifestPath = path.join(androidPath, 'app/src/main/AndroidManifest.xml');

      // Create the directory if it doesn't exist
      if (!fs.existsSync(javaPath)) {
        fs.mkdirSync(javaPath, { recursive: true });
      }

      // Only create Java files, don't touch AndroidManifest.xml
      // Write MainApplication.java
//       fs.writeFileSync(
//         path.join(javaPath, 'MainApplication.java'),
//         `package com.musicshare.app;

// import android.app.Application;
// import com.facebook.react.PackageList;
// import com.facebook.react.ReactApplication;
// import com.facebook.react.ReactNativeHost;
// import com.facebook.react.ReactPackage;
// import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
// import com.facebook.react.defaults.DefaultReactNativeHost;
// import com.facebook.soloader.SoLoader;
// import java.util.List;

// public class MainApplication extends Application implements ReactApplication {
//   private final ReactNativeHost mReactNativeHost =
//       new DefaultReactNativeHost(this) {
//         @Override
//         public boolean getUseDeveloperSupport() {
//           return BuildConfig.DEBUG;
//         }

//         @Override
//         protected List<ReactPackage> getPackages() {
//           List<ReactPackage> packages = new PackageList(this).getPackages();
//           // Add our custom package
//           packages.add(new MediaDetectionPackage());
//           return packages;
//         }

//         @Override
//         protected String getJSMainModuleName() {
//           return "index";
//         }

//         @Override
//         protected boolean isNewArchEnabled() {
//           return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
//         }

//         @Override
//         protected Boolean isHermesEnabled() {
//           return BuildConfig.IS_HERMES_ENABLED;
//         }
//       };

//   @Override
//   public ReactNativeHost getReactNativeHost() {
//     return mReactNativeHost;
//   }

//   @Override
//   public void onCreate() {
//     super.onCreate();
//     SoLoader.init(this, /* native exopackage */ false);
//     if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//       // If you opted-in for the New Architecture, we load the native entry point for this app.
//       DefaultNewArchitectureEntryPoint.load();
//     }
//   }
// }`
//       );

      // Write MediaDetectionModule.java
      fs.writeFileSync(
        path.join(javaPath, 'MediaDetectionModule.java'),
        `package com.musicshare.app;

import android.app.Notification;
import android.content.Context;
import android.media.MediaMetadata;
import android.media.session.MediaController;
import android.media.session.MediaSessionManager;
import android.os.Build;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.List;

public class MediaDetectionModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private MediaSessionManager mediaSessionManager;
    private MediaController.Callback mediaControllerCallback;

    public MediaDetectionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.mediaSessionManager = (MediaSessionManager) reactContext.getSystemService(Context.MEDIA_SESSION_SERVICE);
    }

    @Override
    public String getName() {
        return "MediaDetectionModule";
    }

    @ReactMethod
    public void startMonitoring() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            try {
                List<MediaController> controllers = mediaSessionManager.getActiveSessions(null);
                for (MediaController controller : controllers) {
                    if (isTidalController(controller)) {
                        setupMediaControllerCallback(controller);
                        break;
                    }
                }
            } catch (SecurityException e) {
                WritableMap errorMap = Arguments.createMap();
                errorMap.putString("message", "Permission denied: " + e.getMessage());
                sendEvent("error", errorMap);
            }
        }
    }

    @ReactMethod
    public void stopMonitoring() {
        if (mediaControllerCallback != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                List<MediaController> controllers = mediaSessionManager.getActiveSessions(null);
                for (MediaController controller : controllers) {
                    controller.unregisterCallback(mediaControllerCallback);
                }
            }
            mediaControllerCallback = null;
        }
    }

    private boolean isTidalController(MediaController controller) {
        String packageName = controller.getPackageName();
        return packageName != null && packageName.contains("tidal");
    }

    private void setupMediaControllerCallback(MediaController controller) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            mediaControllerCallback = new MediaController.Callback() {
                @Override
                public void onMetadataChanged(MediaMetadata metadata) {
                    if (metadata != null) {
                        WritableMap trackInfo = Arguments.createMap();
                        trackInfo.putString("title", metadata.getString(MediaMetadata.METADATA_KEY_TITLE));
                        trackInfo.putString("artist", metadata.getString(MediaMetadata.METADATA_KEY_ARTIST));
                        trackInfo.putString("source", "Tidal");
                        sendEvent("trackChanged", trackInfo);
                    }
                }

                @Override
                public void onPlaybackStateChanged(android.media.session.PlaybackState state) {
                    if (state != null) {
                        WritableMap playbackInfo = Arguments.createMap();
                        playbackInfo.putBoolean("isPlaying", state.getState() == android.media.session.PlaybackState.STATE_PLAYING);
                        sendEvent("playbackStateChanged", playbackInfo);
                    }
                }
            };
            controller.registerCallback(mediaControllerCallback);
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}`
      );

      // Write MediaDetectionPackage.java
      fs.writeFileSync(
        path.join(javaPath, 'MediaDetectionPackage.java'),
        `package com.musicshare.app;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MediaDetectionPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MediaDetectionModule(reactContext));
        return modules;
    }
}`
      );

      // Write MusicShareNotificationListenerService.java (renamed from NotificationListenerService.java)
      fs.writeFileSync(
        path.join(javaPath, 'MusicShareNotificationListenerService.java'),
        `package com.musicshare.app;

import android.app.Notification;
import android.content.Context;
import android.os.Build;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;

public class MusicShareNotificationListenerService extends NotificationListenerService {
    private static final String TIDAL_PACKAGE = "com.aspiro.tidal";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn.getPackageName().equals(TIDAL_PACKAGE)) {
            Notification notification = sbn.getNotification();
            if (notification != null && notification.extras != null) {
                String title = notification.extras.getString(Notification.EXTRA_TITLE);
                String text = notification.extras.getString(Notification.EXTRA_TEXT);
            }
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
    }
}`
      );

      return config;
    },
  ]);
}; 