import { Platform, Linking } from 'react-native';

interface Track {
  title: string;
  artist: string;
  source: string;
}

class ShareServiceClass {
  async shareToApp(platform: 'whatsapp' | 'telegram', link: string, track: Track): Promise<void> {
    const message = `🎵 Check out this song: ${track.title} by ${track.artist}\n\n${link}`;
    
    try {
      let shareUrl: string;
      
      if (platform === 'whatsapp') {
        shareUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
        
        // Fallback to web WhatsApp if app is not installed
        const canOpen = await Linking.canOpenURL(shareUrl);
        if (!canOpen) {
          shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        }
      } else {
        // Telegram
        shareUrl = `tg://msg?text=${encodeURIComponent(message)}`;
        
        // Fallback to web Telegram if app is not installed
        const canOpen = await Linking.canOpenURL(shareUrl);
        if (!canOpen) {
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`🎵 ${track.title} by ${track.artist}`)}`;
        }
      }
      
      await Linking.openURL(shareUrl);
    } catch (error) {
      console.error(`Failed to share to ${platform}:`, error);
      throw error;
    }
  }

  async registerAsShareTarget(): Promise<void> {
    // This would be implemented in native code
    // For Android: Add intent filters to AndroidManifest.xml
    // For iOS: Add URL schemes to Info.plist
    
    console.log('Share target registration would be handled in native configuration');
  }
}

export const ShareService = new ShareServiceClass();