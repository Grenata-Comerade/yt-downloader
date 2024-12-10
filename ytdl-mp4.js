const ytdl = require("@distube/ytdl-core");
const { rejects } = require("assert");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { error } = require("console");

function getBasicInfo(url) {
  return ytdl.getBasicInfo(url);
} 

async function getTitle(url) {
  const {title} =  (await ytdl.getBasicInfo(url)).videoDetails;
  return title;
}

async function getDescription(url) {
  const {description} =  (await ytdl.getBasicInfo(url)).videoDetails;
  return description;
}


async function getVideo(url) {
  const title = await getTitle(url);
  const fileName = `nexbase_${title.replace(/\s+/g, "-")}.mp4`;
  const filePath = `/home/grenata/Video/${fileName}`
  const fileStream = fs.createWriteStream(filePath);
  return new Promise((resolve, reject) => {
    ytdl(url, {quality: "highestvideo"}).on("progress", (chunk, downloaded, fileSize) => {
      const percentage = ((downloaded / fileSize) * 100).toFixed(2);
      const size = (fileSize / 1028).toFixed(2);
      console.log(`Downloading video ${title} || ${percentage}% - ${size}kb`);
    }).on("error", reject).on("end", async () => {
      const audioPath = await getAudio(url);
      const videoPath = await merged(filePath, audioPath);
      fs.unlinkSync(audioPath);
      console.log(`Downloading ${title} completed.`);
      resolve(videoPath);
    }).pipe(fileStream);
  });
}

async function getAudio(url) {
  const title = await getTitle(url);
  const fileName = `nexbase_${title.replace(/\s+/g, "-")}.mp3`;
  const filePath = `/home/grenata/Musik/${fileName}`
  const fileStream = fs.createWriteStream(filePath);
  return new Promise((resolve, reject) => {
    ytdl(url, {quality: "highestaudio"})
    .on("progress", (chunk, downloaded, fileSize) => {
      const percentage = ((downloaded / fileSize) * 100).toFixed(2);
      const size = (fileSize / 1028).toFixed(2);
      console.log(`Downloading audio ${title} || ${percentage}% - ${size}kb`);
    }).on("error", reject).on("end", () => {
      console.log(`Downloading audio ${title} completed.`);
      resolve(filePath);
    }).pipe(fileStream);
  });
}

function merged(videoPath, audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(fs.createReadStream(videoPath)).addInput(audioPath).on("error", reject).on("progress", (progress) => {
      console.log(`Merging ${videoPath} & ${audioPath} || ${progress.timemark}`);
    }).on("end", async () => resolve (videoPath)).save(videoPath);
  });
}

(async () => {
  const url = "https://youtu.be/b4wPxyFtPSk?si=hTXfFICk3krrwWYP";
  const url2 = "https://youtu.be/b4wPxyFtPSk?si=hTXfFICk3krrwWYP";
  const video = await getVideo(url);
  console.log(video);
})();
