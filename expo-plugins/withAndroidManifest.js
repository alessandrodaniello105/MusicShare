const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withCustomAndroidManifest(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Add services if they don't exist
    const services = [
      {
        name: 'com.musicshare.app.MediaDetectionService',
        exported: 'true',
        foregroundServiceType: 'mediaPlayback'
      },
      {
        name: 'com.musicshare.app.MusicShareNotificationListenerService',
        exported: 'true',
        permission: 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
        label: '@string/app_name',
        intentFilter: {
          action: 'android.service.notification.NotificationListenerService'
        }
      }
    ];

    // Add each service if it doesn't exist
    services.forEach(service => {
      if (!androidManifest.manifest.application[0].service?.some(s => s.$['android:name'] === service.name)) {
        androidManifest.manifest.application[0].service = androidManifest.manifest.application[0].service || [];
        const serviceConfig = {
          $: {
            'android:name': service.name,
            'android:exported': service.exported,
            ...(service.foregroundServiceType && {
              'android:foregroundServiceType': service.foregroundServiceType
            }),
            ...(service.permission && {
              'android:permission': service.permission
            }),
            ...(service.label && {
              'android:label': service.label
            })
          }
        };

        // Add intent filter if specified
        if (service.intentFilter) {
          serviceConfig['intent-filter'] = [{
            action: [{
              $: {
                'android:name': service.intentFilter.action
              }
            }]
          }];
        }

        androidManifest.manifest.application[0].service.push(serviceConfig);
      }
    });

    // Add intent filters if they don't exist
    const intentFilters = [
      {
        action: 'android.intent.action.SEND',
        category: ['android.intent.category.DEFAULT'],
        data: 'text/plain'
      }
    ];

    // Add each intent filter if it doesn't exist
    intentFilters.forEach(filter => {
      const activity = androidManifest.manifest.application[0].activity?.[0];
      if (!activity) return;

      const existingFilters = activity['intent-filter'] || [];
      const hasFilter = existingFilters.some(f => 
        f.action?.[0]?.$?.['android:name'] === filter.action &&
        f.data?.[0]?.$?.['android:mimeType'] === filter.data
      );

      if (!hasFilter) {
        activity['intent-filter'] = existingFilters;
        activity['intent-filter'].push({
          action: [{
            $: {
              'android:name': filter.action
            }
          }],
          category: filter.category.map(cat => ({
            $: {
              'android:name': cat
            }
          })),
          data: [{
            $: {
              'android:mimeType': filter.data
            }
          }]
        });
      }
    });

    return config;
  });
};