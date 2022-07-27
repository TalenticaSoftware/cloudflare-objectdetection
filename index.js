const t1 = require('@tensorflow/tfjs-backend-cpu')
const t2 = require('@tensorflow/tfjs-backend-webgl')
const cocossd = require('@tensorflow-models/coco-ssd')
//const cheerio = require('cheerio');
//const $ = cheerio.load('<h2 class="title">Hello world</h2>');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const isOdd = require('is-odd');

async function handleRequest(request) {
  let imageData = new ImageData(200, 100);
  console.log('11111');
  let model = await cocossd.load();
  console.log('2222');
  console.log(model);
  let objects = '';
  
 
console.log(isOdd('1')); //=> true
console.log(isOdd('3'));
//   const img = 'https://myawsbucket-clfr.s3.ap-south-1.amazonaws.com/4cats.jpg';
//   const result =  await model.detect(img);
//   if(result.length<1){
//     objects = objects + 'None'
//   }
//   else{
//   for (let i = 0; i < result.length; i++) {
//     objects = objects + result[i].class + ' ';
//   }
// }
  return new Response(objects);
 }

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request));
});