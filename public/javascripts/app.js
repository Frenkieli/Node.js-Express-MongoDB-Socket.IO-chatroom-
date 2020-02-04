socket = io.connect('ws://192.168.3.125:3001', { query: "name=Robby" }); //這邊到時候再改



// 方變自己使用的function
function AE(a,b){
  b.forEach(v=>{
    a.appendChild(v);
  })
}
function CE(a,b,c){
  let d = document.createElement(a);
  if(b) d.className = b;
  if(c) d.id = c;
  return d;
}




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

socket.on('deleteMessage',obj => {
  console.log(obj);
  document.getElementById(obj._id).remove();

  popMessage.ok('資料被刪除', 3000)
})

socket.on('updateMessage',obj => {
  let element = document.getElementById(obj._id).getElementsByClassName( 'msg' )[0];
  element.innerHTML = '';
  element.innerText = obj.msg;
  popMessage.ok('資料被更新', 3000)
})

socket.on('createRecord',obj => {
  console.log('創建結果' ,obj);
})



function appendData(obj) {

  let el = document.querySelector('.chats');
  let html = el.innerHTML;
  obj.forEach(element => {
    let chat = CE('div','chat', element._id ? element._id　:　'');
    let push = [];
      let group= CE('div','group');
      push.push(group);
        let name = CE('div','name');
        name.innerText = element.name + '：';
        let msg  = CE('div','msg');
        msg.innerText = element.msg;
        msg.addEventListener('click',function(e){
          let edit = CE('input');
          edit.type = 'text';
          edit.value = e.target.innerText;
          e.target.innerText = '';
          e.target.appendChild(edit);
          edit.focus();
          edit.addEventListener('keyup',function(e){
            e.preventDefault();
            if (e.keyCode === 13) {
              element.msg = edit.value;
              socket.emit('updateMessage', element);
              let text = edit.value;
              edit.remove();
              msg.innerText = text;
            }
          })
        })
      AE(group,[name,msg]);
      let time = CE('div','time');
      push.push(time);
      time.innerText = moment(element.time).fromNow();
      if(element._id){
        let deleteMe = CE('div','delete');
        push.push(deleteMe);
        deleteMe.innerText = 'X';
        deleteMe.title = '刪除這筆資訊';
        deleteMe.addEventListener('click',function(e){
          socket.emit('deleteMessage', element);
        })
      }
    AE(chat,push);
    AE(el,[chat]);
  });
  // el.innerHTML = html.trim();
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