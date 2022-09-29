import React, { Component } from 'react';

class PeerConnection extends Component {
  state = {
    audiosEl: [],
    calls: []
  };

  componentDidMount() {
    const { socket, myPeer } = this.props;
    const { calls } = this.state;

    socket.on('get other peer id', data => {
      console.log('chamou get other peer id');

      if (myPeer.disconnected) return;
      if (!othersPeersId.includes(data) && data !== myPeer.id) {
        othersPeersId.push(data);
        if (!this.verifyIfCallAlreadyExists(data)) {
          this.callToPeer(data);
        }
      }
    });

    socket.on('disconnect peer', data => {
      let index = 0;
      for (const call of calls) {
        if (call.peer === data) {
          call.close();
          break;
        }
        index++;
      }
      const newCalls = [...calls];
      newCalls.splice(index, 1);
      this.setState({ calls: newCalls });
    });
    let othersPeersId = [];
    this.myPeerFunctions();
  }

  myPeerFunctions = () => {
    const { myPeer } = this.props;
    const { calls } = this.state;

    myPeer.on('call', async call => {
      if (this.verifyIfCallAlreadyExists(call.peer)) return;

      this.setState({ calls: [...this.state.calls, call] });
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      call.answer(stream);
      call.on('stream', remoteStream => {
        this.createNewAudioEl(call.peer, remoteStream);
      });
      call.on('error', error => {
        console.log('deu erro aki meu:', error.type);
      });
    });

    myPeer.on('close', () => {
      console.log('audios zerados');
      calls.map(call => call.close());
      this.setState({ audiosEl: [], calls: [] });
    });
  };

  callToPeer = async id => {
    const { myPeer } = this.props;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    const call = myPeer.call(id, stream, {
      constraints: {
        mandatoty: { OfferToReceiveAudio: true, OfferToReceiveVideo: true }
      }
    });
    this.setState({ calls: [...this.state.calls, call] });

    console.log('nova call with:', call.peer);
    call.on('stream', remoteStream => {
      this.createNewAudioEl(call.peer, remoteStream);
    });
  };

  verifyIfCallAlreadyExists = id => {
    let exists = false;
    for (const call of this.state.calls) {
      if (call.peer === id) {
        exists = true;
        break;
      }
    }
    return exists;
  };

  createNewAudioEl = (peer, remoteStream) => {
    const { audiosEl } = this.state;
    let audioElAlreadyExists = false;
    for (const audio of audiosEl) {
      if (audio.id.split('_')[2] === peer) {
        audioElAlreadyExists = true;
      }
    }
    if (audioElAlreadyExists) return;
    const newAudiosEl = [...audiosEl];
    const id = `other_audio_${peer}`;
    newAudiosEl.push({
      id,
      remoteStream
    });
    this.setState({ audiosEl: newAudiosEl });
  };

  render() {
    const { audiosEl } = this.state;
    return (
      <div id='audio_peers'>
        <h1>
          {audiosEl.map(aud => (
            <audio
              key={aud.id}
              id={aud.id}
              autoPlay={true}
              ref={audio => {
                if (audio) {
                  audio.srcObject = aud.remoteStream;
                }
              }}
            />
          ))}
        </h1>
      </div>
    );
  }
}

export default PeerConnection;
