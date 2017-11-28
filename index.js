(function() {
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
            if(keyCode in KEYCODE) {
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
            var self = this
            Array.prototype.forEach.call(document.querySelectorAll('input,textarea'), function(element) {
                self.find(element)
            })
            document.addEventListener('mousedown', function(event) {
                self.find(event.target)
            })
            document.addEventListener('touchend', function(event) {
                self.find(event.target)
            })
            document.addEventListener('touchmove', function(event) {
                self.find(event.target)
            })
            document.addEventListener('keydown', function(event) {
                var target = event.target
                if(self.isInput(target) && self.list.indexOf(target) < 0) {
                    self.onkewdown(event)
                    self.find(event)
                }
            })
        }
    }

    var inputUI = {
        _key: '',
        _texts: [],
        // 按键dom
        keyEl: null,
        // 文字列表dom
        ulEl: null,
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
            var text = inputUI.texts[index]
            if(!text) {
                text = inputUI.key
            }
            inputUI.key = ''
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
            var self = this
            this._key = data
            this.keyEl.innerText = data
            if(data) {
                this.getText(data, function(texts) {
                    if(self.key === data) {
                        self.texts = texts
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
            var self = this
            this._texts = texts
            this.ulEl.innerHTML = ''
            texts.forEach(function(element, index) {
                var li = document.createElement('wubi-input-element')
                li.classList.add('wubi-input-text-li')
                li.setAttribute('data-index', index)
                if(index === 0) {
                    li.classList.add('text-li-active')
                }
                if(index < 9) {
                    element = index + 1 + '. ' + element
                }
                li.innerText = element
                self.ulEl.appendChild(li)
            })
        },
        get texts() {
            return this._texts
        },
        addTapListener: function(el, callback) {

        },
        init: function() {
            var self = this
            var box = document.createElement('wubi-input-element')
            box.classList.add('wubi-input-box')
            var keyEl = this.keyEl = document.createElement('wubi-input-element')
            this.keyEl.classList.add('wubi-input-key')
            var ulEl = this.ulEl = document.createElement('wubi-input-element')
            ulEl.classList.add('wubi-input-text-ul')
            var touchmove
            ulEl.addEventListener('touchstart', function() {
                event.stopPropagation()
                touchmove = false
            })
            ulEl.addEventListener('touchmove', function() {
                event.stopPropagation()
                touchmove = true
            })
            ulEl.addEventListener('touchend', function(event) {
                event.stopPropagation()
                var target = event.target
                if(!touchmove) {
                    event.preventDefault()
                    if(!target.classList.contains('wubi-input-text-li')) {
                        return
                    }
                    var index = target.getAttribute('data-index')
                    self.send(Number(index))
                }
            })
            box.appendChild(keyEl)
            box.appendChild(ulEl)
            document.body.appendChild(box)
            var style = document.createElement('style')
            style.innerText = 'wubi-input-element{display:block}.wubi-input-box{position:fixed;width:100%;bottom:0;left:0;box-sizing:border-box;padding:0;margin:0;font-size:16px;color:#ffffff;background-color:#282828;z-index:999999999999;text-align:left}.wubi-input-box *{padding:0;margin:0}.wubi-input-box>.wubi-input-key{width:100%;font-size:16px;line-height:20px;padding:0 5px;white-space:nowrap;background-color:#333333}.wubi-input-box>.wubi-input-text-ul{white-space:nowrap;overflow:auto;-webkit-overflow-scrolling:touch}.wubi-input-box>.wubi-input-text-ul::-webkit-scrollbar{display:none}.wubi-input-box>.wubi-input-text-ul>.wubi-input-text-li{display:inline-block;color:#ffffff;font-size:20px;line-height:48px;padding:0 10px}.wubi-input-box>.wubi-input-text-ul>.wubi-input-text-li.text-li-active{color:#b6d0a9}'
            document.head.appendChild(style)
        }
    }

    ready(function() {
        inputUI.init()
        inputs.init()
    })
})()