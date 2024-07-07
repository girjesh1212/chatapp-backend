const axios = require('axios');

const baseUrl = 'http://localhost:1337/api';

async function socketSession(socket, next) {
  const token = socket.handshake.query.token;
  if (token) {
    const axiosRes = await axios.get(`${baseUrl}/users/me`, {
      headers: { 'Authorization': token }
    });
    const userData = axiosRes.data;
    socket.username = userData.username;
    socket.token = token;
    next();
  } else {
    next(new Error('Authentication error'));
  }
}

async function handleSocketMessage(msg, username, token) {
  try {
    if (msg != null && msg.trim != "") {

      const { data } = await axios.post(`${baseUrl}/chats`,
        {
          data: {
            msg: msg,
            username: username
          }
        },
        {
          headers: { 'Authorization': token }
        }).then(r => r.data);

      return JSON.stringify({
        id: data.id,
        msg: data.attributes.msg
      });
    }
    return null;
  } catch (error) {
    return null;
  }
}


module.exports = { handleSocketMessage, socketSession };