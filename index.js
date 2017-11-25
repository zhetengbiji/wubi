var input
document.addEventListener('touchend', updateInput)
document.addEventListener('keydown', updateInput)
// 获取文字
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
// 更新输入框
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
// 按下按键
function kewdown(event) {
    var preventDefault = true
    console.log('kewdown:', event)
    var keyCode = event.keyCode
    var key = show.key
    if(event.key.match(/^[a-z]$/)) {
        show.key += event.key
    } else {
        if(show.key) {
            switch(keyCode) {
                // 删除
                case 8: {
                    show.key = key.substr(0, key.length - 1)
                    break
                }
                // 空格-选中默认
                case 32: {
                    send(0)
                    break
                }
                // 回车-发送字符
                case 13: {
                    send(-1)
                    break
                }
                default: {
                    send(-1)
                    preventDefault = false
                    break
                }
            }
        } else {
            preventDefault = false
        }
    }

    if(preventDefault) {
        event.preventDefault()
    }
}
function send(index) {
    var text = show.texts[index]
    if(!text) {
        text = show.key
    }
    show.key = ''
    var value = input.value
    var range = window.getSelection().getRangeAt(0)
    var index = input.selectionStart + text.length
    input.value = value.substring(0, input.selectionStart) + text + value.substring(input.selectionEnd)
    input.setSelectionRange(index, index)
    input.focus()
}
var key = document.getElementById('key')
var ul = document.getElementById('ul')
ul.addEventListener('click', function(event) {
    var target = event.target
    if(!target.classList.contains('wubi-input-text-li')) {
        return
    }
    var index = target.getAttribute('data-index')
    send(Number(index))
})
var show = {
    _key: '',
    _texts: [],
    set key(data) {
        var self = this
        this._key = data
        key.innerText = data
        if(data) {
            getText(data, function(text) {
                if(self.key === data && text && text[1] && text[1][0]) {
                    self.texts = text[1][0][1]
                }
            })
        } else {
            this.texts = []
        }
    },
    get key() {
        return this._key
    },
    set texts(texts) {
        if(!Array.isArray(texts)) {
            return
        }
        this._texts = texts
        ul.innerHTML = ''
        texts.forEach((element, index) => {
            var li = document.createElement('div')
            li.classList.add('wubi-input-text-li')
            li.setAttribute('data-index', index)
            li.innerText = element
            ul.appendChild(li)
        })
    },
    get texts() {
        return this._texts
    }
}