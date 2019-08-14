
function playAudio(soundobj) {
    var audio1 = document.getElementById(soundobj);
    audio1.play();
}
function StopSound(soundobj) {
    var thissound=document.getElementById(soundobj);
    thissound.pause();
    thissound.currentTime = 0;
}