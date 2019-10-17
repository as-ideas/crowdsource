let {EventEmitter} = require('fbemitter');
const emitter = new EventEmitter();

const Events = {
  emitter: () => {
    return emitter;
  },

  emitEvent: (eventId, ...args) => {
    return emitter.emit(eventId, args);
  },

  addLanguageChangedListener: (listener) => {
    return emitter.addListener('text-changed', listener);
  },

  emitLanguageChangedListener: (text) => {
    return emitter.emit('text-changed', text);
  },

  addUserStateChangedListener: (listener) => {
    return emitter.addListener('user-changed', listener);
  },

  emitUserStateListener: (text) => {
    return emitter.emit('user-changed', text);
  },


};

export default Events;



