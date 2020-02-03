socket = io.connect('ws://localhost:3001', { query: "name=Robby" }); //這邊到時候再改

// socket.on('message', (obj) => {
//   console.log(obj);
// });

// let data = {
//   name: 'Robby',
//   msg: 'Hi~',
// };

// socket.emit('message', data);


function scrollWindow() {
  let h = document.querySelector('.chats');
  h.scrollTo(0, h.scrollHeight);
}

document.querySelector('button').addEventListener('click', () => {
  Send();
});

function Send() {

  let name = document.querySelector('#name').value;
  let msg = document.querySelector('#msg').value;
  if (!msg && !name) {
    alert('請輸入大名和訊息');
    return;
  }
  let data = {
    name: name,
    msg: msg,
  };
  socket.emit('message', data);
  document.querySelector('#msg').value = '';
}

socket.on('message', (obj) => {
  console.log(obj);
  appendData([obj]);
});

socket.on('history', (obj) => {
  // console.log(obj);
  if (obj.length > 0) {
    appendData(obj);
  }
});

socket.on('console', (obj) => {
  console.log(obj);
});
socket.on('popMessage', (obj) => {
  popMessage.ok(obj, 3000)
});

function appendData(obj) {

  let el = document.querySelector('.chats');
  let html = el.innerHTML;

  obj.forEach(element => {
    html +=
      `
          <div class="chat">
              <div class="group">
                  <div class="name">${element.name}：</div>
                  <div class="msg">${element.msg}</div>
              </div>
              <div class="time">${moment(element.time).fromNow()}</div>
          </div>
          `;
  });
  el.innerHTML = html.trim();
  scrollWindow();
}
// document.getElementById('submit').addEventListener('change',function(e){
//   let reader = new FileReader();
//   reader.readAsArrayBuffer();
//   reader.onload=function(){
//     console.log(reader);
//   }
// })

document.getElementById('card_delete').addEventListener('click', function (e) {
  axios.delete('/updata', { data: { deleteName: 'Mayday五月天【你不是真正的快樂You Are Not Truly Happy】MV官方完整版.mp3' }, headers: { "Authorization": "***" } }).then(res => {
    console.log(res);
  })
})
document.getElementById('card_create').addEventListener('click', function (e) {
  if (document.getElementById('card_number').value && document.getElementById('card_name').value) {
    let data = {
      _id: document.getElementById('card_number').value,
      name: document.getElementById('card_name').value
    }
    axios.put('/updata', data);
  } else {
    popMessage.err('至少要輸入點什麼喔', 3000);
  }
})

document.getElementById('submit').addEventListener('click', function (e) {
  e.preventDefault();
  let data = new FormData();
  let updataFile = document.getElementById("file").files;
  // let files = {};
  for (let i = 0; i < updataFile.length; i++) {
    // files[i] = updataFile[i];
    data.append("logo", updataFile[i]);
  }
  // data.append("logo", updataFile[1]);
  // data.append("logo", updataFile[2]);
  // data.append("logo", updataFile[3]);
  // data.append("logo", updataFile);
  // console.log(files);
  // console.log(document.getElementById("file").files[0]);
  axios.post('/updata', data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(res => {
    console.log(res);
    res = res.data.okDataName;
    let url = 'userData/'
    res.img.forEach((v, i) => {
      if (i == 0 && document.getElementsByTagName('img').length == 0) {
        let img = document.createElement('img');
        img.src = url + v;
        document.getElementsByClassName('card_img')[0].appendChild(img);
      }
      let option = new Option(v, v)
      document.getElementById('card_img_list').appendChild(option);
    })
    res.music.forEach((v, i) => {
      if (i == 0 && document.getElementsByTagName('audio').length == 0) {
        let music = document.createElement('audio');
        music.controls = true;
        music.controlsList = "nodownload"
        let source = document.createElement('source');
        source.src = url + v;
        source.type = "audio/" + v.split('.')[v.split('.').length - 1];
        music.appendChild(source);
        document.getElementsByClassName('card_music')[0].appendChild(music);
      }
      let option = new Option(v, v)
      document.getElementById('card_music_list').appendChild(option);
    })
    res.video.forEach((v, i) => {
      if (i == 0 && document.getElementsByTagName('video').length == 0) {
        let video = document.createElement('video');
        let source = document.createElement('source');
        video.controls = true;
        source.src = url + v;
        source.type = "video/" + v.split('.')[v.split('.').length - 1];
        video.appendChild(source);
        document.getElementsByClassName('card_video')[0].appendChild(video);
      }
      let option = new Option(v, v)
      document.getElementById('card_video_list').appendChild(option);
    })
  })

})

// socket.emit('message', 'Hi! Robby');