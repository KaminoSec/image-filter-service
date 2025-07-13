import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMETERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

app.get('/filteredimage', async (req, res) => {
  const { image_url } = req.query;

  // 1. Validate the image_url query
  if (!image_url) {
    return res
      .status(400)
      .send({ message: 'The image_url query parameter is required.' });
  }

  try {
    // Check if it is a valid URL
    new URL(image_url);
  } catch (e) {
    return res.status(400).send({ message: 'Invalid URL format.' });
  }

  try {
    // 2. Call filterImageFromURL
    const filteredPath = await filterImageFromURL(image_url);

    // 3. Send the resulting file in the response
    res.sendFile(filteredPath, {}, (err) => {
      // 4. Delete any files on the server on finish of the response
      deleteLocalFiles([filteredPath]);
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (error) {
    console.error('There was an error processing the image:', error.message);
    res.status(422).send({
      message:
        'The system was unable to process the image at the URL you provided.',
    });
  }
});

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get('/', async (req, res) => {
  res.send('try GET /filteredimage?image_url={{}}');
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log('press CTRL+C to stop server');
});
