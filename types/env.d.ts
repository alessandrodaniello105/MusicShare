declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_TIDAL_API_KEY: string;
      EXPO_PUBLIC_YOUTUBE_API_KEY: string;
    }
  }
}

export {};