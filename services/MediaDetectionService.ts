import { Platform, NativeEventEmitter, NativeModules, PermissionsAndroid, Linking, Alert } from 'react-native';

interface Track {
  title: string;
  artist: string;
  source: string;
}

type TrackCallback = (track: Track | null) => void;

class MediaDetectionServiceClass {
  private callback: TrackCallback | null = null;
  private isMonitoring: boolean = false;
  private eventEmitter: NativeEventEmitter | null = null;

  private async openAppSettings() {
    try {
      await Linking.openSettings();
      Alert.alert(
        'Permission Required',
        'Please enable all required permissions in the settings and return to the app.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
  }

  private async requestNotificationAccess(): Promise<boolean> {
    try {
      console.log('Opening notification access settings...');
      await Linking.openSettings();
      console.log('Please enable notification access for Music Share in the settings');
      
      // Wait for user to enable notification access
      return new Promise((resolve) => {
        const checkAccess = async () => {
          try {
            const isEnabled = await NativeModules.MediaDetectionModule.isNotificationServiceEnabled();
            console.log('Notification service enabled:', isEnabled);
            if (isEnabled) {
              resolve(true);
            } else {
              console.log('Notification access not yet granted, checking again in 1 second...');
              setTimeout(checkAccess, 1000); // Check again after 1 second
            }
          } catch (error) {
            console.error('Error checking notification access:', error);
            resolve(false);
          }
        };
        checkAccess();
      });
    } catch (error) {
      console.error('Failed to open notification settings:', error);
      return false;
    }
  }

  async startMonitoring(callback: TrackCallback): Promise<void> {
    console.log('Starting media detection...');
    this.callback = callback;
    this.isMonitoring = true;

    if (Platform.OS === 'android') {
      try {
        console.log('Requesting permissions...');
        // Request necessary permissions
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ];

        console.log('Checking existing permissions...');
        const existingPermissions = await Promise.all(
          permissions.map(async permission => {
            const result = await PermissionsAndroid.check(permission);
            console.log(`Permission ${permission} already granted:`, result);
            return result;
          })
        );

        const allGranted = existingPermissions.every(granted => granted);
        console.log('All permissions already granted:', allGranted);

        if (!allGranted) {
          console.log('Requesting missing permissions...');
          const results = await Promise.all(
            permissions.map(async permission => {
              const result = await PermissionsAndroid.request(permission);
              console.log(`Permission ${permission} result:`, result);
              return result;
            })
          );

          console.log('All permission results:', results);

          // Check if any permission was permanently denied
          const hasPermanentDenial = results.some(
            result => result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
          );

          if (hasPermanentDenial) {
            console.log('Some permissions were permanently denied, opening settings...');
            Alert.alert(
              'Permissions Required',
              'Some permissions are required for the app to work. Please enable them in settings.',
              [
                {
                  text: 'Open Settings',
                  onPress: () => this.openAppSettings()
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => {
                    console.log('User cancelled permission request');
                    if (this.callback) {
                      this.callback(null);
                    }
                  }
                }
              ]
            );
            return;
          }

          const allGranted = results.every(
            result => result === PermissionsAndroid.RESULTS.GRANTED
          );

          if (!allGranted) {
            console.error('Not all permissions were granted');
            throw new Error('Required permissions not granted');
          }
        }

        console.log('All permissions granted, checking notification access...');
        // Check if notification access is already enabled
        const isEnabled = await NativeModules.MediaDetectionModule.isNotificationServiceEnabled();
        console.log('Notification service already enabled:', isEnabled);

        if (!isEnabled) {
          console.log('Requesting notification access...');
          const notificationAccessGranted = await this.requestNotificationAccess();
          if (!notificationAccessGranted) {
            console.error('Notification access not granted');
            throw new Error('Notification access not granted');
          }
        }

        console.log('Setting up event listeners...');
        // Set up event listener for native module events
        this.eventEmitter = new NativeEventEmitter(NativeModules.MediaDetectionModule);
        
        // Listen for track changes
        this.eventEmitter.addListener('trackChanged', (event) => {
          console.log('Track changed event received:', event);
          if (this.callback && this.isMonitoring) {
            this.callback({
              title: event.title || 'Unknown Title',
              artist: event.artist || 'Unknown Artist',
              source: 'Tidal'
            });
          }
        });

        // Listen for errors
        this.eventEmitter.addListener('error', (error) => {
          console.error('Media detection error:', error);
          if (this.callback) {
            this.callback(null);
          }
        });

        console.log('Starting native module monitoring...');
        // Start monitoring in native module
        await NativeModules.MediaDetectionModule.startMonitoring();
        console.log('Media detection started successfully');
      } catch (error) {
        console.error('Failed to start media detection:', error);
        if (this.callback) {
          this.callback(null);
        }
      }
    }
  }

  stopMonitoring(): void {
    console.log('Stopping media detection...');
    this.isMonitoring = false;
    
    if (Platform.OS === 'android') {
      // Stop monitoring in native module
      NativeModules.MediaDetectionModule.stopMonitoring();
      
      // Remove event listeners
      if (this.eventEmitter) {
        this.eventEmitter.removeAllListeners('trackChanged');
        this.eventEmitter.removeAllListeners('error');
        this.eventEmitter = null;
      }
    }
    
    this.callback = null;
    console.log('Media detection stopped');
  }
}

export const MediaDetectionService = new MediaDetectionServiceClass();