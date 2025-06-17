const { withDangerousMod } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');
const { resolve } = require('path');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');

const CONVERTED_TO_KOTLIN = [
  'MainActivity',
  'MainApplication',
  'MediaDetectionModule',
  'MediaDetectionPackage',
  'MusicShareNotificationListenerService'
];

const withJavaFiles = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const packageRoot = resolve(config.modRequest.platformProjectRoot, 'app/src/main/java/com/musicshare/app');
      
      // Create the directory if it doesn't exist
      if (!existsSync(packageRoot)) {
        mkdirSync(packageRoot, { recursive: true });
      }

      // Only generate Java files that haven't been converted to Kotlin
      const filesToGenerate = [
        {
          name: 'MainActivity',
          template: getMainActivityTemplate(),
        },
        {
          name: 'MainApplication',
          template: getMainApplicationTemplate(),
        },
        {
          name: 'MediaDetectionModule',
          template: getMediaDetectionModuleTemplate(),
        },
        {
          name: 'MediaDetectionPackage',
          template: getMediaDetectionPackageTemplate(),
        },
        {
          name: 'MusicShareNotificationListenerService',
          template: getNotificationListenerServiceTemplate(),
        },
      ].filter(file => !CONVERTED_TO_KOTLIN.includes(file.name));

      for (const file of filesToGenerate) {
        const filePath = resolve(packageRoot, `${file.name}.java`);
        writeFileSync(filePath, file.template);
      }

      return config;
    },
  ]);
};

module.exports = withJavaFiles; 