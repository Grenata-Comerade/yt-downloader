const ytdl = require("@distube/ytdl-core")

async function getBasicInfo(url) {
  return ytdl.getBasicInfo(url);
}
async function getTitle(url) {
  const info = await ytdl.getBasicInfo(url);
  return info;
}

async function getKeywords(url) {
  const {keywords} = (await ytdl.getBasicInfo(url)).videoDetails;
  return keywords;
}

(async () => {
  const url = ""; // paste your YouTube Link
  const info = await getTitle(url);
  console.log(info);
})();
