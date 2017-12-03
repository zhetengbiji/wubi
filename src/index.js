var Iframe = require('./Iframe')

function ready(callback) {
    function completed() {
        if(typeof callback === 'function') {
            callback()
            callback = null
        }
    }
    if(document.readyState === "complete") {
        completed()
    } else {
        document.addEventListener("DOMContentLoaded", completed, false)
        window.addEventListener("load", completed, false)
    }
}

var KEYCODE = { '65': 'a', '66': 'b', '67': 'c', '68': 'd', '69': 'e', '70': 'f', '71': 'g', '72': 'h', '73': 'i', '74': 'j', '75': 'k', '76': 'l', '77': 'm', '78': 'n', '79': 'o', '80': 'p', '81': 'q', '82': 'r', '83': 's', '84': 't', '85': 'u', '86': 'v', '87': 'w', '88': 'x', '89': 'y', '90': 'z', }
var KEYCODE_NUM = { '49': 1, '50': 2, '51': 3, '52': 4, '53': 5, '54': 6, '55': 7, '56': 8, '57': 9 }

var inputs = {
    list: [],
    active: null,
    add: function(target) {
        this.list.push(target)
        var value = target.value
        target.addEventListener('keydown', this.onkewdown, false)
        target.addEventListener('blur', function() {
            inputUI.key = ''
            if(!this.__isChange && value !== this.value) {
                this.dispatchEvent(new Event('change', {
                    bubbles: true
                }))
            }
            this.__isChange = false
            value = this.value
        })
    },
    onkewdown: function(event) {
        var preventDefault = true
        var keyCode = event.keyCode
        var key = inputUI.key
        if(keyCode in KEYCODE && !event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
            inputUI.key += KEYCODE[keyCode]
        } else {
            if(inputUI.key) {
                if(keyCode in KEYCODE_NUM) {
                    inputUI.send(KEYCODE_NUM[keyCode] - 1)
                } else {
                    switch(keyCode) {
                        // 删除
                        case 8: {
                            inputUI.key = key.substr(0, key.length - 1)
                            break
                        }
                        case 46: {
                            inputUI.key = key.substr(0, key.length - 1)
                            break
                        }
                        // 空格-选中默认
                        case 32: {
                            inputUI.send(0)
                            break
                        }
                        // 回车-发送字符
                        case 13: {
                            inputUI.send(-1)
                            break
                        }
                        // Alt
                        case 18: {
                            break
                        }
                        default: {
                            inputUI.send(-1)
                            preventDefault = false
                            break
                        }
                    }
                }
            } else {
                event.target.__isChange = true
                preventDefault = false
            }
        }

        if(preventDefault) {
            event.preventDefault()
        }
    },
    isInput: function(target) {
        var tagName = target.tagName
        var type = target.getAttribute('type')
        return ((tagName === 'INPUT' && (!type || type === 'search' || type === 'text')) || tagName === 'TEXTAREA')
    },
    find: function(target) {
        if(this.isInput(target) && this.list.indexOf(target) < 0) {
            this.add(target)
        }
    },
    init: function() {
        Array.prototype.forEach.call(document.querySelectorAll('input,textarea'), (element) => {
            this.find(element)
        })
        document.addEventListener('mousedown', (event) => {
            this.find(event.target)
        })
        document.addEventListener('touchend', (event) => {
            this.find(event.target)
        })
        document.addEventListener('touchmove', (event) => {
            this.find(event.target)
        })
        document.addEventListener('keydown', (event) => {
            var target = event.target
            if(this.isInput(target) && this.list.indexOf(target) < 0) {
                this.onkewdown(event)
                this.find(event)
            }
        })
    }
}

var inputUI = {
    _key: '',
    _texts: [],
    iframe: null,
    // 获取文字
    getTextByGoogle: function(text, successCallback, errorCallback) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://ssssss.link/inputtools/request?text=' + text + '&itc=zh-t-i0-wubi-1986&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8')
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
                    if(data && data[1] && data[1][0]) {
                        successCallback && successCallback(data[1][0][1])
                    }
                } else {
                    console.error('error:', xhr.status)
                    errorCallback && errorCallback(xhr)
                }
            }
        }
        xhr.send(null)
    },
    getText: function(text, successCallback, errorCallback) {
        var js = document.createElement('script')
        var callbackName = '__callback' + Date.now()
        var timeout = 10000
        var timing
        function end() {
            clearTimeout(timing)
            delete window[callbackName]
            js.remove()
        }
        window[callbackName] = function(res) {
            if(typeof successCallback === 'function' && res && res.data) {
                successCallback(res.data)
            }
            end()
        }
        js.onerror = function() {
            if(typeof errorCallback === 'function') {
                errorCallback()
            }
            end()
        }
        timing = setTimeout(function() {
            if(typeof errorCallback === 'function') {
                errorCallback()
            }
            end()
        }, timeout)
        js.src = 'https://i-weather.cn/api/?key=wubi&callback=' + callbackName + '&text=' + text
        document.body.appendChild(js)
    },
    send: function(index) {
        var text = this.texts[index]
        if(!text) {
            text = this.key
        }
        this.key = ''
        var input = document.activeElement
        var value = input.value
        var range = window.getSelection().getRangeAt(0)
        var index = input.selectionStart + text.length
        input.value = value.substring(0, input.selectionStart) + text + value.substring(input.selectionEnd)
        input.setSelectionRange(index, index)
        input.focus()
        input.dispatchEvent(new Event('input', {
            bubbles: true
        }))
    },
    set key(data) {
        this._key = data
        this.iframe.evalJS(`onKey('${data}')`)
        if(data) {
            this.iframe.show()
            this.getText(data, (texts) => {
                if(this.key === data) {
                    this.texts = texts
                }
            })
        } else {
            this.iframe.hide()
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
        this.iframe.evalJS(`onTexts(${JSON.stringify(texts)})`)
    },
    get texts() {
        return this._texts
    },
    init: function() {
        var iframe = this.iframe = new Iframe()
        iframe.loadData(require('./ui.html'))
        iframe.on('select', event => {
            this.send(event.detail)
        })
    }
}

ready(function() {
    inputUI.init()
    inputs.init()
})