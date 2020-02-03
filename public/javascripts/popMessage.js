// var css = 
//     '#popMessage_module { '+
//     'background: red; }',

//     head = document.head || document.getElementsByTagName('head')[0],
//     style = document.createElement('style');

// head.appendChild(style);

// style.type = 'text/css';
// if (style.styleSheet) {
//     // This is required for IE8 and below.
//     style.styleSheet.cssText = css;
// } else {
//     style.appendChild(document.createTextNode(css));
// }
var popMessage = (function () {
    // cus追加的背景顏色與文字顏色記得寫在這邊
    let colorData = {
        color: ['#eee', '#eee'],
        backColor: ['#1CAF64', '#AF1C1C'],
    },
        status;


    let _data = function (arr) {
        colorData.color = ['#eee', '#eee', ...arr.color];
        colorData.backColor = ['#1CAF64', '#AF1C1C', ...arr.backColor];
    }

    let _ok = function (str, time) {
        status = 0;
        _main(str, time);
    }

    let _no = function (str, time) {
        status = 1;
        _main(str, time);
    }

    let _cus = function (str, i, time) {
        status = i + 2;
        _main(str, time);
    }

    let _main = function (str, time) {
        // console.log(colorData,'顏色');
        var pop;
        if (document.getElementById("popMessage_module")) {
            pop = document.getElementById("popMessage_module");
        } else {
            pop = document.createElement("div");
            pop.id = "popMessage_module";
            document.getElementsByTagName("body")[0].appendChild(pop);
        }
        let boxStyle = pop.style;
        boxStyle.position = "fixed";
        boxStyle.right = document.body.clientWidth < 600 ? "10px" : "25px";
        boxStyle.bottom = document.body.clientWidth < 600 ? "10px" : "25px";
        // console.log(document)
        let popStr = document.createElement("div");
        let style = popStr.style;
        popStr.innerText = str;
        style.color = colorData.color[status];
        style.backgroundColor = colorData.backColor[status];
        style.border = "1px solid rgba(0,0,0,0.8)";
        style.position = "relative";
        style.margin = "10px";
        style.fontSize = document.body.clientWidth < 600 ? "16px" : "22px";
        style.padding = "10px";
        style.borderRadius = "10px";
        let count = 100;

        let timeClock = setInterval(() => {
            count -= 2;
            style.transform = 'translate( ' + count * 1 + '%)';
            if (count <= 0) {
                clearInterval(timeClock);
            }
        }, 1);

        let count2 = 100;
        setTimeout(() => {
            let timeClock2 = setInterval(() => {
                count2 -= 10;
                style.opacity = count2 / 100;
                if (count2 <= 0) {
                    clearInterval(timeClock2);
                    popStr.remove();
                }
            }, 50);
        }, time);
        // 放進去
        pop.appendChild(popStr);
    }

    return {
        data: _data,
        ok: _ok,
        err: _no,
        cus: _cus,
    };
}());