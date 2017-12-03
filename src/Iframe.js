function Iframe() {
    var self = this
    var dom = this.dom = document.createElement('iframe')
    dom.setAttribute('style',
        `position: fixed;
        display: none;
        width: 100%;
        height: 68px;
        bottom: 0;
        left: 0;
        padding: 0;
        margin: 0;
        z-index: 999999999999;
        border: none;`)
    this.id = Date.now()
    dom.onload = () => {
        dom.contentWindow.currentIframe = this
        this.emit('loaded')
    }
    dom.onerror = () => {
        this.emit('error')
    }
    function hashchange() {
        window.removeEventListener('hashchange', hashchange, false)
        self.close()
    }
    window.addEventListener('hashchange', hashchange, false)
    document.body.appendChild(dom)
}
Iframe.prototype.evalJS = function(js) {
    var dom = this.dom
    if(dom) {
        dom.contentWindow.eval(js)
    }
}
Iframe.prototype.loadData = function(html) {
    var dom = this.dom
    if(dom) {
        var blob = new Blob([html], {
            'type': 'text/html'
        })
        dom.src = URL.createObjectURL(blob)
    }
}
Iframe.prototype.show = function(callback) {
    this.dom.style.display = 'block'
    if(typeof callback === 'function') {
        callback()
    }
    this.emit('show')
}
Iframe.prototype.hide = function(callback) {
    this.dom.style.display = 'none'
    if(typeof callback === 'function') {
        callback()
    }
    this.emit('hide')
}
Iframe.prototype.close = function(callback) {
    this.hide(() => {
        this.dom.remove()
        this.dom = null
        if(typeof callback === 'function') {
            callback()
        }
        this.emit('close')
    })
}
Iframe.prototype.on = function(type, callback) {
    window.addEventListener(`iframe${this.id}${type}`, callback, false)
}
Iframe.prototype.off = function(type, callback) {
    window.addEventListener(`iframe${this.id}${type}`, callback, false)
}
Iframe.prototype.emit = function(type, data) {
    document.dispatchEvent(new CustomEvent(`iframe${this.id}${type}`, {
        detail: data,
        bubbles: true,
        cancelable: true
    }))
}

module.exports = Iframe