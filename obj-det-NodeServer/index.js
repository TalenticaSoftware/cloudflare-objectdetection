const t1 = require('@tensorflow/tfjs-backend-cpu');
const t2 = require('@tensorflow/tfjs-backend-webgl')
const cocossd = require('@tensorflow-models/coco-ssd')
const tf = require('@tensorflow/tfjs')
var express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
var app = express();
app.use("/", router);
app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);
var bodyParser = require('body-parser');
var jsonparser = bodyParser.json({ limit: '50mb' });
const cors = require('cors');


router.use(cors({
  origin: '*'
}));
router.post('/', jsonparser, async function (req, res) {
  var array = req.body;
  var imgArray = new Int32Array(480000);

  for (var i in array)
    imgArray[i] = array[i];

  var newBuffer = tf.buffer([400, 400, 3], 'int32', imgArray);
  var ten_obj1 = newBuffer.toTensor();
  let model = await cocossd.load();
  const result = await model.detect(ten_obj1);
  let objects = '';
  if (result.length < 1) {
    objects = objects + 'None'
  }
  else {
    for (let i = 0; i < result.length; i++) {
      objects = objects + result[i].class + ' ';
    }
  }
  res.send(objects);
});

router.get('/', function(req, res) { 
  res.render('index.html');
});
var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('running at 127.0.0.1:' + port);
});  