'use strict';

const notify = require('./alert');
const chat = require('./chat');
const preferences = require('./preferences');
const user = require('./user');

/**
 * [left description]
 * @return {[type]} [description]
 */
function left() {
  chat.addChatMessage('Your partner has left.', {
    class: 'message-system'
  });

  chat.hideChatTyping();
  notify.alertUser("Partner Left");
  user.setPartner(false);
}

/**
 * [joined description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function connected(data) {
  chat.showChatBox();

  chat.addChatMessage('You have been connected with a partner.', {
    class: 'message-system'
  });

  chat.addChatMessage(''+
    'Your partner is a generic.',
  {class: 'message-system'});

  user.setPartner(true);

  notify.alertUser("Partner Connected");

  document.getElementById('block-partner').classList.remove("hide-ele");
}

/**
 * [blocked description]
 * @return {[type]} [description]
 */
function blocked() {
  if (user.getPartner() == true) {
    user.setPartner(false);

    chat.addChatMessage('Your partner has been blocked and disconnected from you.', {
      class: 'message-system'
    });
  } else {
    chat.addChatMessage('Your previous partner has been blocked.', {
      class: 'message-system'
    });
  }
  
  chat.hideChatTyping();
}

/**
 * [pending description]
 * @return {[type]} [description]
 */
function pending() {
  chat.showChatBox();

  chat.addChatMessage(''+
  'We are looking for a partner to match you with. '+
  'Please continue to wait until you are no longer waiting.', {
    class: 'message-system'
  });
}

/**
 * [disconnected description]
 * @return {[type]} [description]
 */
function disconnected() {
  chat.addChatMessage('Your partner has disconnected unexpectedly.', {
    class: 'message-system'
  });

  chat.hideChatTyping();
  notify.alertUser("Partner Disconnected");
  user.setPartner(false);
}

/**
 * [blockPartner description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function blockPartner(socket) {
  if (!confirm('Are you sure you want to block this partner?')) {
    return false;
  }

  socket.send(JSON.stringify({type:'block_partner', data: true}));
}

function findPartner(socket) {    
  if (document.getElementById("sidebar").classList.contains('active-sidebar')) {
    document.getElementById("sidebar").classList.toggle('active-sidebar');
  }

  if (user.getPartner()) {
    if (!confirm('Are you sure you want to find a new partner?')) {
      return false;
    }

    chat.addChatMessage('You have disconnected from your previous partner.', {
      class: 'message-system'
    });
  }

  const data = preferences.validate();

  if (data) {
    user.setPartner(false);
    socket.send(JSON.stringify({type:'find_partner', data: data}));
    chat.showChatBox();
  }
}

module.exports = {
  find: findPartner,
  connected: connected,
  left: left,
  blocked: blocked,
  pending: pending,
  disconnected: disconnected,
  block: blockPartner,
};
