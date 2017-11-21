var input
document.addEventListener('touchstart', function(event) {
    var target = event.target
    var tagName = target.tagName
    if(tagName === 'INPUT' || tagName === 'TEXTAREA') {
        input = target
        input.addEventListener('keydown', kewdown)
    }
})
function kewdown(event) {
    event.preventDefault()
    console.log(event)
}