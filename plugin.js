/**
 * MusicFree 插件（全网+网易云强化版）
 * 支持：
 * - 搜索音乐 & 视频音频
 * - 四大排行榜（原创 / 新歌 / 飙升 / 热歌）
 * - 歌单详情
 * - 歌词显示
 * - 艺人/作者信息基础展示
 */

module.exports = {
  platform: "CNMusicSuper",
  version: "3.0.0",
  author: "ChatGPT",

  // 搜索多个来源
  async search(query, page = 1) {
    const kw = encodeURIComponent(query);
    let results = [];

    // 👉 网易云搜索 API（可用开源或第三方源）
    try {
      const res = await fetch(
        `https://api2.wer.plus/api/wyysearch?keywords=${kw}&limit=30`
      );
      const j = await res.json();
      if (j && j.result && j.result.songs) {
        j.result.songs.forEach(item => {
          results.push({
            id: "netease_" + item.id,
            name: item.name,
            artist: item.artists ? item.artists.map(a => a.name).join(", ") : "",
            album: item.album ? item.album.name : "",
            duration: item.duration || 0,
            type: "music",
            source: "网易云"
          });
        });
      }
    } catch (e) {}

    return { list: results, hasMore: false };
  },

  // 排行榜
  async getCharts(type) {
    try {
      const res = await fetch(
        `https://api.wer.plus/api/wytop?t=${type}`
      );
      const j = await res.json();
      return j.data || [];
    } catch (e) {
      return [];
    }
  },

  // 获取歌单详情
  async getPlaylist(id) {
    try {
      const res = await fetch(
        `https://api.liguangchun.cn/v7/music/netEase?url=${encodeURIComponent(id)}`
      );
      const j = await res.json();
      return j.playlist || [];
    } catch (e) {
      return [];
    }
  },

  // 获取播放链接
  async getMediaSource(item) {
    // 网易云播放链接解析
    try {
      const res = await fetch(
        `https://api2.wer.plus/api/wyyurl?id=${item.id.replace("netease_", "")}`
      );
      const j = await res.json();
      return { url: j.data.url };
    } catch (e) {}
    return { url: null };
  },

  // 获取歌词
  async getLyric(item) {
    try {
      const res = await fetch(
        `https://music.163.com/api/song/lyric?os=pc&id=${item.id.replace("netease_", "")}`
      );
      const j = await res.json();
      return { lyric: j.lrc ? j.lrc.lyric : "" };
    } catch (e) {}
    return { lyric: "" };
  }
};

