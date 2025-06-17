import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onHide: () => void;
}

export function Toast({ message, type, onHide }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onHide, 3000);
    return () => clearTimeout(timer);
  }, [onHide]);

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle : XCircle;
  const colors = isSuccess 
    ? ['#10b981', '#059669'] 
    : ['#ef4444', '#dc2626'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors}
        style={styles.toast}
      >
        <Icon size={20} color="white" />
        <Text style={styles.message}>{message}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 24,
    right: 24,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    flex: 1,
  },
});