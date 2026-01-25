import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

interface VideoUploadData {
  episodeId: string;
  quality: '1080p' | '720p' | '480p';
  file: Buffer;
  mimeType: string;
}

interface SubtitleUploadData {
  episodeId: string;
  language: string;
  label: string;
  file: Buffer;
}

export class VideoStorage {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = join(process.cwd(), 'uploads', 'videos');
  }

  async ensureDirectoryExists() {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      // Directory already exists, ignore error
    }
  }

  async uploadVideo(data: VideoUploadData): Promise<string> {
    await this.ensureDirectoryExists();
    
    const videoId = uuidv4();
    const filename = `${data.episodeId}_${data.quality}_${videoId}.mp4`;
    const filePath = join(this.uploadDir, filename);
    
    await writeFile(filePath, data.file);
    
    // Return public URL - in production this would be a CDN URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/videos/${filename}`;
  }

  async uploadSubtitle(data: SubtitleUploadData): Promise<string> {
    await this.ensureDirectoryExists();
    
    const subtitleId = uuidv4();
    const filename = `${data.episodeId}_${data.language}_${subtitleId}.vtt`;
    const filePath = join(this.uploadDir, filename);
    
    await writeFile(filePath, data.file);
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/videos/${filename}`;
  }

  async getVideoQuality(episodeId: string, quality: string): Promise<string | null> {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/videos/quality?episodeId=${episodeId}&quality=${quality}`);
      
      if (!response.ok) return null;
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting video quality:', error);
      return null;
    }
  }

  async createQualityVariants(originalUrl: string, episodeId: string) {
    // This would integrate with video transcoding services
    const qualities = [
      { quality: '1080p', url: originalUrl },
      { quality: '720p', url: originalUrl.replace('.mp4', '_720p.mp4') },
      { quality: '480p', url: originalUrl.replace('.mp4', '_480p.mp4') }
    ];

    return qualities;
  }

  async generateThumbnail(videoUrl: string, episodeId: string): Promise<string> {
    // This would integrate with thumbnail generation services
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return `${baseUrl}/api/videos/thumbnail?episodeId=${episodeId}`;
  }

  async getSubtitles(episodeId: string): Promise<Array<{language: string, url: string, label: string}>> {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/videos/subtitles?episodeId=${episodeId}`);
      
      if (!response.ok) return [];
      const data = await response.json();
      return data.subtitles || [];
    } catch (error) {
      console.error('Error getting subtitles:', error);
      return [];
    }
  }
}