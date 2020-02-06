socket = io.connect('ws://192.168.3.125:3001', { query: "name=Robby" }); //這邊到時候再改
let url = 'userData/';


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




document.getElementById('card_list').addEventListener('change',async function(e){
  let result = await axios.get('/updata/' + e.target.value);
  let medicalrecordsResule = await axios.get('/medicalrecords/' + e.target.value);
  playList = medicalrecordsResule.data.playlist;
  playListTime = [];
  total = 0;
  nowTime = 0;
  playList.forEach((v,i) => {
    playListTime.push(v.time);
    total += v.time * 1;
    document.getElementById('view_section_pick').add(new Option('No.' + (i + 1) + '-' + v.time, i))
  });
  viewSectionChange(0);
  let data = {
    img:[],
    video:[],
    music:[]
  };
  if(result.data){
    result.data.forEach(v=>{
      let inData = v.split('.');
      switch (inData[inData.length - 1]) {
        case ('jpg'||'jpeg'||'png'):
          data.img.push(v);
          break;
          case ('mp4'||'ogg'):
            data.video.push(v);
          break;
        case ('mp3'):
          data.music.push(v);
          break;
        default:
          break;
      }
    })
  }

  console.log(data);
  appendRecord(data, url + e.target.value + '/')
})

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
  axios.post('/updata/' + document.getElementById('card_list').value, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(res => {
    console.log(res);
    res = res.data.okDataName;
    appendRecord(res, url + document.getElementById('card_list').value + '/')
    // appendImg(res.img, url + '1234567890/');
    // res.img.forEach((v, i) => {
      //   if (i == 0 && document.getElementsByTagName('img').length == 0) {
        //     let img = document.createElement('img');
        //     img.src = url + v;
        //     document.getElementsByClassName('card_img')[0].appendChild(img);
        //   }
        //   let option = new Option(v, v)
        //   document.getElementById('card_img_list').appendChild(option);
        // })
    // appendMusic(res.music, url + '1234567890/');
    // res.music.forEach((v, i) => {
      //   if (i == 0 && document.getElementsByTagName('audio').length == 0) {
        //     let music = document.createElement('audio');
        //     music.controls = true;
        //     music.controlsList = "nodownload"
        //     let source = document.createElement('source');
        //     source.src = url + v;
        //     source.type = "audio/" + v.split('.')[v.split('.').length - 1];
        //     music.appendChild(source);
        //     document.getElementsByClassName('card_music')[0].appendChild(music);
        //   }
        //   let option = new Option(v, v)
        //   document.getElementById('card_music_list').appendChild(option);
        // })
    // appendImg(res.video, url + '/1234567890/');
  //   res.video.forEach((v, i) => {
  //     if (i == 0 && document.getElementsByTagName('video').length == 0) {
  //       let video = document.createElement('video');
  //       let source = document.createElement('source');
  //       video.controls = true;
  //       source.src = url + v;
  //       source.type = "video/" + v.split('.')[v.split('.').length - 1];
  //       video.appendChild(source);
  //       document.getElementsByClassName('card_video')[0].appendChild(video);
  //     }
  //     let option = new Option(v, v)
  //     document.getElementById('card_video_list').appendChild(option);
  //   })
  })
})

function appendRecord(data, url){
  appendImg(data.img, url);
  appendMusic(data.music, url);
  appendVideo(data.video, url);
}

function appendImg(data, url){
  data.forEach((v, i) => {
    if (i == 0 && document.getElementsByClassName('card_img')[0].getElementsByTagName('img').length == 0) {
      let img = document.createElement('img');
      img.id = 'card_img_now';
      img.src = url + v;
      document.getElementsByClassName('card_img')[0].appendChild(img);
    }
    let option = new Option(v, v)
    document.getElementById('card_img_list').appendChild(option);
  })
}
function appendMusic(data, url){
  data.forEach((v, i) => {
    if (i == 0 && document.getElementsByClassName('card_music')[0].getElementsByTagName('audio').length == 0) {
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
}
function appendVideo(data, url){
  data.forEach((v, i) => {
    if (i == 0 && document.getElementsByClassName('card_video')[0].getElementsByTagName('video').length == 0) {
      let video = document.createElement('video');
      let source = document.createElement('source');
      video.id = 'card_video_now';
      video.controls = true;
      source.src = url + v;
      source.type = "video/" + v.split('.')[v.split('.').length - 1];
      video.appendChild(source);
      document.getElementsByClassName('card_video')[0].appendChild(video);
    }
    let option = new Option(v, v)
    document.getElementById('card_video_list').appendChild(option);
  })
}


function viewSectionBuild (type){
  let view = document.getElementById('view');
  view.innerHTML = '';
  let array=[];
  function objBuild(i){
    let element = CE('div','view_obj');
    if(i==1){
      element.classList.add('pick');
    }
    element.id = 'obj' + i ;
    let img = CE('img');
    img.src = './images/imgobj.svg';
    AE(element,[img]);
    return element;
  }
  switch (type ? type : document.getElementById('view_section_type').value) {
    case '0':
      view.className = 'type1';
      for(let i=1 ; i <= 3 ; i++){
        array.push(objBuild(i));
      }
      break;
      case '1':
        view.className = 'type2';
        array.push(objBuild(1));
        break;
    default:
      console.log('失敗',document.getElementById('view_section_type').value)
      break;
  }
  array.forEach(element => {
    element.addEventListener('click',function(e){
      for(let i = 0 ; i < array.length;i++){
        array[i].classList.remove('pick');
      }
      element.classList.add('pick');
    })
  });
  AE(view,array)
}

// document.getElementById('view_section_type').addEventListener('change',viewSectionBuild)


// let view_obj = document.getElementsByClassName('view_obj');
// for(let i = 0 ; i<view_obj.length;i++){
//   view_obj[i].addEventListener('click',function(e){
//     for(let i = 0 ; i<view_obj.length;i++){
//       view_obj[i].classList.remove('pick');
//     }
//     view_obj[i].classList.add('pick');
//   })
// }

document.getElementById('card_video_button').addEventListener('click',function(e){
  let obj = document.querySelector('.view_obj.pick').id;
  console.log(playList[document.getElementById('view_section_pick').value]);
  playList[document.getElementById('view_section_pick').value][obj] = document.getElementById('card_video_now').querySelector('source').src;
  let element = document.querySelector('.view_obj.pick');
  element.innerHTML = '';
  let video = document.getElementById('card_video_now').cloneNode(true);
  video.controls =false;
  element.appendChild(video);
})
document.getElementById('card_img_button').addEventListener('click',function(e){
  let obj = document.querySelector('.view_obj.pick').id;
  playList[document.getElementById('view_section_pick').value][obj] = document.getElementById('card_img_now').src;
  let element = document.querySelector('.view_obj.pick');
  element.innerHTML = '';
  element.appendChild(document.getElementById('card_img_now').cloneNode(true));
})

let videoPlayStatus = false;
let playStatus;
document.getElementById('progress_button').addEventListener('click',function(e){
  let video = document.getElementById('view').getElementsByTagName('video');
  if(videoPlayStatus){
    videoPlayStatus = false;
    for(let i = 0;i<video.length;i++){
      video[i].pause();
    }
  }else{
    videoPlayStatus = true;
    for(let i = 0;i<video.length;i++){
      video[i].play();
    }
  }
  if(playStatus){
    clearInterval(playStatus);
    playStatus = false;
    return;
  }else{
    playStatus = setInterval(() => {
      nowTime += 0.1;
      let result = (nowTime / total);
      if(result >= 1){
        clearInterval(playStatus);
        playStatus = false;
        return;
      }
      console.log({nowTime,result,total} , 3/3)
      document.getElementById('progress_bar_color').style.width = result * 100  + '%';
      progressCalc();
    }, 100);
  }
})

let playList =[];
let playListTime =[];
let total = 0;
let nowTime =0;


function countProgressTime (){
  total = 0;
  playListTime = [];
  playList.forEach(v=>{
    total += v.time * 1;
    playListTime.push(v.time);
  })
  
  document.getElementById('progress_time').innerText = total;
  let view_section_pick = document.getElementById('view_section_pick');
  view_section_pick.innerHTML = '';
  playListTime.forEach((v,i)=>{
    let option = new Option('No.' + (i + 1) + '-' + v + 's',i);
    view_section_pick.add(option);
  })
}

document.getElementById('view_section_create').addEventListener('click',function(e){
  let data = {
    type:document.getElementById('view_section_type').value,
    time:document.getElementById('view_section_time').value
  }
  playList.push(data);
  viewSectionBuild();
  countProgressTime();
});
document.getElementById('view_section_edit').addEventListener('click',function(e){
  let id = document.getElementById('card_list').value;
  axios.post('/medicalrecords/' + id , playList)
})




function mouseProgressmove(e){
  e.preventDefault();
  document.getElementById('progress_bar_color').style.width = document.getElementById('progress_bar_color').offsetWidth + e.movementX +'px';
  progressCalc(true);
}
let check = -1;
function progressCalc(changeNowTime){
  let box = document.getElementsByClassName('progress_bar')[0].offsetWidth;
  let progress = document.getElementById('progress_bar_color').offsetWidth;
  let result = progress / box;
  let time = 0;
  let view_section_pick = document.getElementById('view_section_pick');
  for(let i =0 ;i < playListTime.length;i++){
    time += playListTime[i] * 1 ;
    console.log({total , result, time});
    if(time > (total * result) ){
      view_section_pick.options[i].selected = true ;
      viewChange(i);
      viewSectionChange(i);
      break;
    }
  }
  if(changeNowTime){
    nowTime = total * result;
    let video = document.getElementById('view').getElementsByTagName('video');
    let currentPlayListTime=0;
    for(let i = 0 ; i < view_section_pick.value ; i++){
      currentPlayListTime += playListTime[i] *1
    }
      
    for(let i =0 ; i <video.length;i++){
      
      video[i].currentTime = nowTime * 1 - currentPlayListTime * 1;
    }
  };
  // console.log(nowTime)
}
document.getElementById('progress_bar_button').addEventListener('mousedown',function(e){
  document.addEventListener('mousemove',mouseProgressmove);
})
document.addEventListener('mouseup',function(e){
  document.removeEventListener('mousemove',mouseProgressmove);
})
document.addEventListener('mouseleave',function(e){
  document.removeEventListener('mousemove',mouseProgressmove);
})

document.getElementById('view_section_pick').addEventListener('change',function(e){
  viewChange(e.target.value);
  viewSectionChange(e.target.value);
})

function viewItemBuild(data){
  let type = data.split('.')[data.split('.').length - 1];
  let element;
  switch (type) {
    case ('jpg'||'jpeg'||'png'):
        element = document.createElement('img');
        element.src = data;
      break;
      case ('mp4'||'ogg'):
        element = document.createElement('video');
        let source = document.createElement('source');
        source.src = data;
        if(videoPlayStatus){
          element.autoplay = true;
        }
        source.type = "video/" + type;
        element.appendChild(source);
      break;
    default:
      break;
  }
  return element;
}
let nowPrintData;
function viewSectionChange(i){
  let printData = playList[i];
  if(nowPrintData != printData){
    nowPrintData = printData;
    console.log(playList);
    viewSectionBuild(printData.type);
    setTimeout(() => {
      console.log(printData,'這是什麼阿');
      switch (printData.type) {
        case '0':
          for(let i = 1 ; i <= 3 ; i++){
            if(printData['obj' + i]){
              document.getElementById('obj'+ i ).innerHTML = '';
              let element = viewItemBuild(printData['obj' + i]);
              document.getElementById('obj'+ i ).appendChild(element);
            }
          }
          break;
        case '1':
          if(printData['obj1']){
            document.getElementById('obj1').innerHTML = '';
            let element = viewItemBuild(printData['obj1']);
            document.getElementById('obj1').appendChild(element);
          }
          break;
        default:
          break;
      }
    }, 0);
  }
}


let viewNow = -1;
function viewChange(index){
  if(viewNow != index){
    console.log(index,'現在是什麼');
    viewNow = index;
  }
}

// socket.emit('message', 'Hi! Robby');