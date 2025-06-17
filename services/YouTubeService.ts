interface YouTubeSearchResponse {
  items: Array<{
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      channelTitle: string;
    };
    statistics?: {
      viewCount: string;
    };
  }>;
}

class YouTubeServiceClass {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || '';
  }

  async searchTrack(query: string): Promise<string | null> {
    try {
      if (!this.apiKey) {
        console.error('YouTube API key not configured');
        return null;
      }

      const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&` +
        `q=${encodeURIComponent(query)}&` +
        `type=video&` +
        `order=viewCount&` +
        `maxResults=1&` +
        `key=${this.apiKey}`;

      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data: YouTubeSearchResponse = await response.json();
      
      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
      }

      return null;
    } catch (error) {
      console.error('YouTube search error:', error);
      return null;
    }
  }

  async getVideoDetails(videoId: string) {
    try {
      if (!this.apiKey) {
        console.error('YouTube API key not configured');
        return null;
      }

      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
        `part=snippet,statistics&` +
        `id=${videoId}&` +
        `key=${this.apiKey}`;

      const response = await fetch(detailsUrl);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return data.items[0];
      }

      return null;
    } catch (error) {
      console.error('YouTube video details error:', error);
      return null;
    }
  }
}

export const YouTubeService = new YouTubeServiceClass();