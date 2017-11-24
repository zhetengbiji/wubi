var input
document.addEventListener('touchend', updateInput)
document.addEventListener('keydown', updateInput)
function getText(text, successCallback, errorCallback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://ssssss.link/inputtools/request?text=' + text + '&itc=zh-t-i0-wubi-1986&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage')
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if(xhr.status == 200) {
                var res = xhr.responseText
                var data
                try {
                    data = JSON.parse(res)
                } catch(error) {
                    console.error('error:', error)
                    errorCallback && errorCallback(error)
                }
                console.log(data)
                successCallback && successCallback(data)
            } else {
                console.error('error:', xhr.status)
                errorCallback && errorCallback(xhr)
            }
        }
    }
    xhr.send(null)
}
function updateInput(event) {
    var target = event.target
    var tagName = target.tagName
    // target === document.activeElement
    if((tagName === 'INPUT' || tagName === 'TEXTAREA') && target !== input) {
        console.log(target)
        input && input.removeEventListener('keydown', kewdown, false)
        input = target
        // kewdown(event)
        input.addEventListener('keydown', kewdown, false)
    }
}
function kewdown(event) {
    console.log(event)
    event.preventDefault()
    var keyCode = event.keyCode
    var key = show.key
    switch(keyCode) {
        case 8:
            show.key = key.substr(0, key.length - 1)
            break;
        default:
            if(event.key.match(/^[a-z]$/)) {
                show.key += event.key
            }
            break;
    }

}
var key = document.getElementById('key')
var ul = document.getElementById('ul')
var show = {
    _key: '',
    set key(data) {
        this._key = data
        key.innerText = data
        getText(data, function(text) {
            var texts = text[1][0][1]
            ul.innerHTML = ''
            texts.forEach(element => {
                var li = document.createElement('div')
                li.classList.add('text-li')
                li.innerText = element
                ul.appendChild(li)
            })
        })
    },
    get key() {
        return this._key
    }
}