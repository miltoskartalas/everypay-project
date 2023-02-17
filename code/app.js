const express = require('express');
const axios = require('axios'); 
const client = require('prom-client')
const register = new client.Registry();


register.setDefaultLabels({
  app: 'everypay-app'
})

const requestDurationHistogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 5, 10]
});
register.registerMetric(requestDurationHistogram);

client.collectDefaultMetrics({ register })
function convertNumberToMonth(index) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return months[index-1];
}
const app = express();

function handleSIGTERM(signal) {
  console.log(`*^!@4=> Received event: ${signal}`)

}
process.on('SIGTERM', handleSIGTERM)

// Expose the Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    res.status(500).end();
  }
});
app.get('/comics/:start/:end', async (req, res) => {
  const end = requestDurationHistogram.startTimer();

  try {
    // Parse start and end parameters as integers, in case of not a integer, cut the decimal part
    const start = parseInt(req.params.start);
    const end = parseInt(req.params.end);

    // Check if the range provided is valid
    if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start >= end) {
      throw new Error('Please provide a valid range of comic numbers');
    }

    const comics = [];
    for (let i = start + 1; i <= end; i++) {
      const response = await axios.get(`https://xkcd.com/${i}/info.0.json`);
    
      if(parseInt(response.data.month) % 2 == 1){
         
        comics.push({month: (convertNumberToMonth(response.data.month)),title : response.data.title});
      }
    }

    // Filter odd months and sort by title alphabetically
    const filteredComics = comics.sort((a, b) => a.title.localeCompare(b.title));

    // Check if there are any comics in the filtered array
    if (filteredComics.length === 0) {
      throw new Error('No comics found in the specified range and odd months');
    }

    // Send back the filtered and sorted comics as the response
    res.send(filteredComics);
  } catch (error) {
    // In case of an error send back the message
    res.status(400).send(error.message);
  }finally {
    end({ method: req.method, route: req.route.path, status_code: res.statusCode });
  }
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});