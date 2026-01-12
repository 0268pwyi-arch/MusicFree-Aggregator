/**
 * Bilibili 视频音频 插件
 * 支持：搜索 / 播放
 */

module.exports = {
  platform: "bilibili",
  version: "1.0.0",
  author: "ChatGPT",

  async search(query, page = 1) {
    const results = [];
    try {
      const kw = encodeURIComponent(query);
      const res = await fetch(`https://api2.wer.plus/api/bilibili_search?keyword=${kw}&page=${page}`);
      const j = await res.json();
      (j.data || []).forEach(item => {
        results.push({
          id: `bili_${item.bvid}`,
          name: item.title,
          artist: item.author,
          album: "",
          duration: item.duration * 1000,
          type: "video"
        });
      });
    } catch (e) {}
    return { list: results, hasMore: false };
  },

  async getMediaSource(item) {
    try {
      const bvid = item.id.replace("bili_", "");
      const res = await fetch(`https://api2.wer.plus/api/bilibili_url?bvid=${bvid}`);
      const j = await res.json();
      return { url: (j.data.audio || j.data.video) || null };
    } catch (e) {
      return { url: null };
    }
  },

  async getLyric(item) {
    return { lyric: "" };
  },

  async importPlaylist(url) {
    return [];
  }
};
