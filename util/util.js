import fs from 'fs';
import axios from 'axios';
import Jimp from 'jimp';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the image using axios to get a clean buffer
      const response = await axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      const photo = await Jimp.read(response.data);
      const outpath =
        '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';

      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, () => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
