import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, MessageCircle, Send, ExternalLink } from 'lucide-react-native';

interface Track {
  title: string;
  artist: string;
  source: string;
}

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: (platform: 'whatsapp' | 'telegram') => void;
  track: Track | null;
  youtubeLink: string | null;
}

export function ShareModal({ visible, onClose, onShare, track, youtubeLink }: ShareModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <LinearGradient
                colors={['white', '#fafafa']}
                style={styles.modalContent}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Share Music</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {track && (
                  <View style={styles.trackPreview}>
                    <Text style={styles.previewTitle} numberOfLines={1}>
                      {track.title}
                    </Text>
                    <Text style={styles.previewArtist} numberOfLines={1}>
                      {track.artist}
                    </Text>
                  </View>
                )}

                {youtubeLink && (
                  <View style={styles.linkPreview}>
                    <ExternalLink size={16} color="#8b5cf6" />
                    <Text style={styles.linkText} numberOfLines={1}>
                      YouTube link ready
                    </Text>
                  </View>
                )}

                <View style={styles.shareOptions}>
                  <TouchableOpacity
                    style={styles.shareOption}
                    onPress={() => onShare('whatsapp')}
                  >
                    <LinearGradient
                      colors={['#25d366', '#128c7e']}
                      style={styles.shareOptionGradient}
                    >
                      <MessageCircle size={24} color="white" />
                      <Text style={styles.shareOptionText}>WhatsApp</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.shareOption}
                    onPress={() => onShare('telegram')}
                  >
                    <LinearGradient
                      colors={['#0088cc', '#006bb3']}
                      style={styles.shareOptionGradient}
                    >
                      <Send size={24} color="white" />
                      <Text style={styles.shareOptionText}>Telegram</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackPreview: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  previewArtist: {
    fontSize: 14,
    color: '#64748b',
  },
  linkPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    gap: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8b5cf6',
    flex: 1,
  },
  shareOptions: {
    gap: 12,
  },
  shareOption: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  shareOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  shareOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});