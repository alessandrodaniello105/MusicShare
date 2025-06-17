import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Key, Youtube, Music, Info, ExternalLink } from 'lucide-react-native';

export default function SettingsScreen() {
  const settingsItems = [
    {
      icon: Key,
      title: 'API Keys',
      subtitle: 'Configure Tidal and YouTube API keys',
      onPress: () => {
        // TODO: Navigate to API keys configuration
      },
    },
    {
      icon: Music,
      title: 'Media Detection',
      subtitle: 'Configure music detection settings',
      onPress: () => {
        // TODO: Navigate to media detection settings
      },
    },
    {
      icon: Youtube,
      title: 'YouTube Search',
      subtitle: 'Customize search preferences',
      onPress: () => {
        // TODO: Navigate to YouTube search settings
      },
    },
    {
      icon: Info,
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => {
        // TODO: Show about dialog
      },
    },
  ];

  return (
    <LinearGradient
      colors={['#fef7ff', '#f3e8ff', '#e9d5ff']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Settings size={32} color="#8b5cf6" />
        </View>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Configure your music sharing preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingsItem,
                index !== settingsItems.length - 1 && styles.settingsItemBorder
              ]}
              onPress={item.onPress}
            >
              <View style={styles.settingsItemIcon}>
                <item.icon size={24} color="#8b5cf6" />
              </View>
              <View style={styles.settingsItemContent}>
                <Text style={styles.settingsItemTitle}>{item.title}</Text>
                <Text style={styles.settingsItemSubtitle}>{item.subtitle}</Text>
              </View>
              <ExternalLink size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            1. Play music on Tidal{'\n'}
            2. Open this app to detect current track{'\n'}
            3. Tap "Share to YouTube" to find the song{'\n'}
            4. Choose WhatsApp or Telegram to share
          </Text>
        </View>
      </ScrollView>
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
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingsItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  infoCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
});