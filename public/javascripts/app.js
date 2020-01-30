socket = io.connect('ws://localhost:3001');

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
  if (obj.length > 0) {
    appendData(obj);
  }
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


document.getElementById('submit').addEventListener('click', function (e) {
  e.preventDefault();
  let data = new FormData();
  let updataFile = document.getElementById("file").files;
  let files = {};
  for (let i = 0; i < updataFile.length; i++) {
    files[i] = updataFile[i];
  }
  data.append("file", files);
  console.log(files);
  console.log(document.getElementById("file").files[0]);
  axios.post('/updata', data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(res => {
    console.log(res);
  })

})

// socket.emit('message', 'Hi! Robby');