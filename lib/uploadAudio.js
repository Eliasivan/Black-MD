import axios from 'axios';

const uploadAudio = async (audioBuffer) => {
  const response = await axios.post('https://file.io', audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });

  return response.data.link;
};

export default uploadAudio;