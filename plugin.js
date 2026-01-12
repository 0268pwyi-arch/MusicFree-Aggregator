/**
 * MusicFree 插件：中国音乐+视频音频聚合
 * 注意：请替换下面示例 API URLs
 * 成为可用稳定 API 服务
 */
module.exports = {
  platform: "CNMusicVideo",
  version: "1.0.0",
  author: "YourName",
  description: "聚合国内主流音乐和视频音频搜索播放插件",

  async search(query, page = 1) {
    const kw = encodeURIComponent(query);
    const results = [];

    try {
      const resp1 = await fetch(`https://你的音乐API.example/search?kw=${kw}&p=${page}`);
      const musicJson = await resp1.json();
      (musicJson.data || []).forEach(item => {
        results.push({
          id: `music_${item.id}`,
          name: item.title,
          artist: item.artist,
          album: item.album,
          duration: item.duration,
          type: "music",
        });
      });
    } catch {}

    try {
      const resp2 = await fetch(`https://你的视频API.example/search?kw=${kw}&p=${page}`);
      const videoJson = await resp2.json();
      (videoJson.data || []).forEach(item => {
        results.push({
          id: `video_${item.id}`,
          name: item.title,
          artist: item.channel || "",
          album: "",
          duration: item.duration,
          type: "video",
        });
      });
    } catch {}

    return { list: results, hasMore: false };
  },

  async getMediaSource(item) {
    if (item.type === "music") {
      try {
        const res = await fetch(`https://你的音乐API.example/play?id=${item.id.replace("music_", "")}`);
        const json = await res.json();
        return { url: json.url };
      } catch {}
    }
    if (item.type === "video") {
      try {
        const res = await fetch(`https://你的视频API.example/play?id=${item.id.replace("video_", "")}`);
        const json = await res.json();
        return { url: json.audioUrl || json.url };
      } catch {}
    }
    return { url: null };
  },

  async getLyric(item) {
    try {
      const res = await fetch(`https://你的音乐API.example/lyric?id=${item.id}`);
      const json = await res.json();
      return { lyric: json.lyric || "" };
    } catch {}
    return { lyric: "" };
  }
};
