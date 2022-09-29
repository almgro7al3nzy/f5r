import React from 'react';
import play from 'audio-play';

import { arrayBufferToAudioBuffer } from 'arraybuffer-to-audiobuffer';

const Test = ({ socket }) => {
  socket.on('audio buffer', async data => {
    await playAudio(data);
  });

  const playAudio = async data => {
    try {
      const audioBUffer = await arrayBufferToAudioBuffer(data);
      play(audioBUffer);
    } catch (err) {
      throw new Error(err);
    }
  };

  const init = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    const context = new AudioContext();
    const input = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);

    input.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = e => {
      const blob = new Blob([e.inputBuffer]);
      socket.emit('audio buffer', blob);
    };
  };

  init();

  // socket.on('audio buffer', data => {
  //   console.log(data);
  // });

  return (
    <div>
      <h1>is it gonna work?</h1>
      <audio autoPlay id='audio' />
    </div>
  );
};

export default Test;
