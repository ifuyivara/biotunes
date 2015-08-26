var $ = require('jquery'),
    fs = require('fs'),
    ipc = require('ipc')

var musicFolder = '/Users/ivanfuyivara/Downloads/biotunes/music'

//
// Track display and playback
//

// Read the audio files, write the names to the page
fs.readdir(musicFolder, function(err, files) {
  for (var file of files) {
    $('#audio-files').append(`<li>${file}</li>`)
  }
})
// //
var playTrack = function(target) {
  $('#audio-files li').removeClass('on')

  var fileName = target.text()
  target.addClass('on')

  $('#audio-player').html(`
    <audio controls>
      <source src="${musicFolder}/${fileName}" type="audio/mp3">
    </audio>
  `).children().first()[0].play()

  ipc.send('track.changed', target.text())

}

$('#audio-files').on('click', 'li', function(e) {
  playTrack($(e.currentTarget))
})


//
// Electron events
//
//
ipc.on('player.next', function() {
  var current = $('#audio-files li.on'),
      next = null

  if (current) {
    next = current.next()
  }

  if (!next.length) {
    next = $('#audio-files li:first')
  }

  playTrack(next)
})

ipc.on('player.previous', function() {
  var current = $('#audio-files li.on'),
      previous = null

  if (current) {
    previous = current.prev()
  }

  if (!previous.length) {
    previous = $('#audio-files li:last')
  }

  playTrack(previous)
})

ipc.on('player.playpause', function() {
  var target = $('#audio-player audio')
  if (target.length) {
    target = target[0]
    if (target.paused) {
      target.play()
    } else {
      target.pause()
    }
  }
})


ipc.on('console.log', function() {
  console.log.apply(console, arguments)
})
