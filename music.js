function playAudio(soundobj) {
    var audio1 = document.getElementById(soundobj);
    // Browsers may require a click before allowing hover-triggered audio.
    // Leaving the card while playback starts can also cancel this promise.
    audio1.play().catch(function () {});
}
function StopSound(soundobj) {
    var thissound=document.getElementById(soundobj);
    thissound.pause();
    thissound.currentTime = 0;
}
