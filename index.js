var input
document.addEventListener('touchend', updateInput)
document.addEventListener('keydown', updateInput)
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
    },
    get key() {
        return this._key
    }
}