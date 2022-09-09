const t1 = require('@tensorflow/tfjs-backend-cpu')
const t2 = require('@tensorflow/tfjs-backend-webgl')
const cocossd = require('@tensorflow-models/coco-ssd')
const tf = require('@tensorflow/tfjs');


async function handleRequest(request) {
  let url = new URL(request.url);
  model = await cocossd.load();
  let img = null;
  let objects = '';

  await request.arrayBuffer().then((buffer) => {

    img = new Int32Array(buffer);
  });
  // .toml config
  //kv_namespaces = [
  //{ binding = "MY_KV", id = "e9f1f787b96245e79f1d15067e0b5afb" , preview_id = "e9f1f787b96245e79f1d15067e0b5afb"}
  //]
  //let value = await MY_KV.get("img_array", { type: "arrayBuffer" });
  // if(value === null){
  //   await MY_KV.put("img_array", img);
  //   value = await MY_KV.get("img_array", { type: "arrayBuffer" });
  // }
  //let newarr = new Int32Array(value);
  var newBuffer = tf.buffer([400, 400, 3], 'int32', img);
  var ten_obj1 = newBuffer.toTensor();
  console.log('start : ' + new Date());
  const result = await model.detect(ten_obj1);
  console.log('end : ' + new Date());
  if (result.length < 1) {
    objects = objects + 'None'
  }
  else {
    for (let i = 0; i < result.length; i++) {
      objects = objects + result[i].class + ' ';
    }
  }

  let response = new Response(objects);
  const responseHeaders = new Headers(response.headers)
  responseHeaders.set('Access-Control-Allow-Origin', '*')
  return new Response(response.body, {
    headers: responseHeaders,
    status: response.status,
    statusText: response.statusText
  })
}


function getFullTimestamp() {
  let pad = (n, s = 2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
  let d = new Date();

  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request));
});