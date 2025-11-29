export interface MusicTrack {
  src: string;
  name?: string;
}

export const musicTracks: MusicTrack[] = [
  { src: "/music/song1.mp3", name: "Song 1" },
  // Add more music files here
  // Example:
  // { src: "/music/song2.mp3", name: "Song 2" },
];

