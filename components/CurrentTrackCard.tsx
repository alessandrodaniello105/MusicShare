import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Music, Radio } from 'lucide-react-native';

interface Track {
  title: string;
  artist: string;
  source: string;
}

interface CurrentTrackCardProps {
  track: Track | null;
  isDetecting: boolean;
}

export function CurrentTrackCard({ track, isDetecting }: CurrentTrackCardProps) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['white', '#fafafa']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            {isDetecting ? (
              <Radio size={28} color="#8b5cf6" />
            ) : (
              <Music size={28} color="#8b5cf6" />
            )}
          </View>
          <Text style={styles.cardTitle}>
            {isDetecting ? 'Listening...' : 'Now Playing'}
          </Text>
        </View>

        {track ? (
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={2}>
              {track.title}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {track.artist}
            </Text>
            <View style={styles.sourceTag}>
              <Text style={styles.sourceText}>{track.source}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noTrackInfo}>
            <Text style={styles.noTrackText}>
              {isDetecting 
                ? 'Waiting for music to play...' 
                : 'No music detected'
              }
            </Text>
            <Text style={styles.noTrackSubtext}>
              Start playing music on Tidal to begin
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardGradient: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  trackInfo: {
    alignItems: 'flex-start',
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 32,
  },
  trackArtist: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 16,
  },
  sourceTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
    textTransform: 'uppercase',
  },
  noTrackInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noTrackText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  noTrackSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});