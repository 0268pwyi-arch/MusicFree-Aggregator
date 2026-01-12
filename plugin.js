/**
 * MusicFree 插件：国内主流音乐 + 视频音频聚合
 * 依赖第三方 API（免费/公开/可用）
 */

module.exports = {
  platform: "CNMusicVideoAll",
  version: "1.0.0",
  author: "ChatGPT",
  description: "支持主流音乐平台&视频音频聚合搜索与播放",

  async search(query, page = 1) {
    const kw = encodeURIComponent(query);
    const results = [];

    // 🎵 音乐聚合搜索示例（第三方服务）
    try {
      const resMusic = await fetch(
        `https://apis.kit9.cn/api/kuwo_search/all?key=free&keyword=${kw}&pn=${page}`
      );
      const jsonMusic = await resMusic.json();
      const list = (jsonMusic.data && jsonMusic.data.list) || [];
      list.forEach(item => {
        results.push({
          id: `music_${item.hash}`,
          name: item.name,
          artist: item.artist,
          album: item.album,
          duration: item.duration || 0,
          type: "music",
        });
      });
    } catch (e) {
      console.warn("音乐搜索异常", e);
    }

    // 🎬 视频音频（B站）
    try {
      const resBili = await fetch(
        `https://api.aa1.cn/v1/apilist?type=bilibili_search&keyword=${kw}`
      );
      const jsonBili = await resBili.json();
      const vids = jsonBili.data || [];
      vids.forEach(v => {
        results.push({
          id: `video_${v.bvid}`,
          name: v.title,
          artist: v.author,
          album: "",
          duration: v.duration || 0,
          type: "video",
        });
      });
    } catch (e) {
      console.warn("视频搜索异常", e);
    }

    return { list: results, hasMore: false };
  },

  async getMediaSource(item) {
    // 🎵 音乐播放
    if (item.type === "music") {
      try {
        const res = await fetch(
          `https://apis.kit9.cn/api/kuwo_song/play?key=free&hash=${item.id.replace("music_", "")}`
        );
        const j = await res.json();
        if (j && j.data && j.data.url) {
          return { url: j.data.url };
        }
      } catch (e) {
        console.warn("获取音乐播放失败", e);
      }
    }

    // 🎧 视频音频提取（B站）
    if (item.type === "video") {
      try {
        const res = await fetch(
          `https://api.aa1.cn/bilibili/?id=${item.id.replace("video_", "")}`
        );
        const j = await res.json();
        if (j && j.data) {
          return { url: j.data.audio || j.data.url };
        }
      } catch (e) {
        console.warn("视频音频提取失败", e);
      }
    }

    return { url: null };
  },

  async getLyric(item) {
    if (item.type === "music") {
      try {
        const res = await fetch(
          `https://apis.kit9.cn/api/kuwo_song/lyric?key=free&hash=${item.id.replace("music_", "")}`
        );
        const j = await res.json();
        return { lyric: (j.data && j.data.lyric) || "" };
      } catch (e) {
        console.warn("获取歌词失败", e);
      }
    }
    return { lyric: "" };
  },
};
