const { withInfoPlist } = require('@expo/config-plugins');

module.exports = function withCustomIOSInfo(config) {
  return withInfoPlist(config, config => {
    const infoPlist = config.modResults;
    
    // Add URL schemes
    infoPlist.CFBundleURLTypes = infoPlist.CFBundleURLTypes || [];
    
    // Custom URL scheme
    infoPlist.CFBundleURLTypes.push({
      CFBundleURLName: 'com.musicshare.app',
      CFBundleURLSchemes: ['musicshare']
    });
    
    // Tidal URL scheme
    infoPlist.CFBundleURLTypes.push({
      CFBundleURLName: 'tidal-handler',
      CFBundleURLSchemes: ['tidal']
    });
    
    // Add privacy usage descriptions
    infoPlist.NSAppleMusicUsageDescription = 'This app needs access to Apple Music to detect currently playing songs and share them on YouTube.';
    infoPlist.NSMediaLibraryUsageDescription = 'This app needs access to your media library to detect currently playing music.';
    
    // Add background modes
    infoPlist.UIBackgroundModes = infoPlist.UIBackgroundModes || [];
    const backgroundModes = ['audio', 'background-processing', 'background-fetch'];
    backgroundModes.forEach(mode => {
      if (!infoPlist.UIBackgroundModes.includes(mode)) {
        infoPlist.UIBackgroundModes.push(mode);
      }
    });
    
    // Add associated domains
    infoPlist['com.apple.developer.associated-domains'] = [
      'applinks:tidal.com',
      'applinks:listen.tidal.com'
    ];
    
    // Add queries schemes
    infoPlist.LSApplicationQueriesSchemes = infoPlist.LSApplicationQueriesSchemes || [];
    const schemes = ['whatsapp', 'whatsapp-business', 'tg', 'telegram', 'tidal', 'spotify', 'music'];
    schemes.forEach(scheme => {
      if (!infoPlist.LSApplicationQueriesSchemes.includes(scheme)) {
        infoPlist.LSApplicationQueriesSchemes.push(scheme);
      }
    });
    
    return config;
  });
};