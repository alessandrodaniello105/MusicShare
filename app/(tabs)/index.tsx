import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Music, Share2, Youtube, MessageCircle, Send } from 'lucide-react-native';
import { MediaDetectionService } from '@/services/MediaDetectionService';
import { YouTubeService } from '@/services/YouTubeService';
import { ShareService } from '@/services/ShareService';
import { CurrentTrackCard } from '@/components/CurrentTrackCard';
import { ShareModal } from '@/components/ShareModal';
import { Toast } from '@/components/Toast';

interface Track {
  title: string;
  artist: string;
  source: string;
}

export default function HomeScreen() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Start monitoring media session
    const startMediaDetection = async () => {
      try {
        await MediaDetectionService.startMonitoring((track) => {
          setCurrentTrack(track);
        });
      } catch (error) {
        console.error('Failed to start media detection:', error);
        showToast('Failed to start media detection', 'error');
      }
    };

    startMediaDetection();

    return () => {
      MediaDetectionService.stopMonitoring();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleShareMusic = async () => {
    if (!currentTrack) {
      showToast('No track currently playing', 'error');
      return;
    }

    setIsSearching(true);
    try {
      const searchQuery = `${currentTrack.title} ${currentTrack.artist}`;
      const link = await YouTubeService.searchTrack(searchQuery);
      
      if (link) {
        setYoutubeLink(link);
        setShowShareModal(true);
      } else {
        showToast('No song found on YT', 'error');
      }
    } catch (error) {
      console.error('Search failed:', error);
      showToast('Search failed. Please try again.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleShare = async (platform: 'whatsapp' | 'telegram') => {
    if (!youtubeLink || !currentTrack) return;

    try {
      await ShareService.shareToApp(platform, youtubeLink, currentTrack);
      setShowShareModal(false);
      setYoutubeLink(null);
      showToast(`Shared to ${platform}!`, 'success');
    } catch (error) {
      console.error('Share failed:', error);
      showToast('Share failed. Please try again.', 'error');
    }
  };

  return (
    <LinearGradient
      colors={['#fef7ff', '#f3e8ff', '#e9d5ff']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Music size={32} color="#8b5cf6" />
        </View>
        <Text style={styles.headerTitle}>Music Share</Text>
        <Text style={styles.headerSubtitle}>Share your Tidal music to YouTube</Text>
      </View>

      <View style={styles.content}>
        <CurrentTrackCard 
          track={currentTrack}
          isDetecting={!currentTrack}
        />

        <TouchableOpacity
          style={[
            styles.shareButton,
            (!currentTrack || isSearching) && styles.shareButtonDisabled
          ]}
          onPress={handleShareMusic}
          disabled={!currentTrack || isSearching}
        >
          <LinearGradient
            colors={currentTrack && !isSearching ? ['#8b5cf6', '#7c3aed'] : ['#cbd5e1', '#94a3b8']}
            style={styles.shareButtonGradient}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Share2 size={24} color="white" />
            )}
            <Text style={styles.shareButtonText}>
              {isSearching ? 'Searching...' : 'Share to YouTube'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ShareModal
        visible={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setYoutubeLink(null);
        }}
        onShare={handleShare}
        track={currentTrack}
        youtubeLink={youtubeLink}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  shareButton: {
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shareButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});