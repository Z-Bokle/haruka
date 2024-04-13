export const user = {
  register: '/user/register',
  login: '/user/login',
  info: '/user/info',
};

export const text = {
  listModel: '/text/model/list',
  listPrePrompts: '/text/preprompt/list',
  generate: '/text/generate',
  updateItems: '/text/items/update',
};

export const session = {
  list: '/session/list',
  info: '/session/info',
  create: '/session/create',
  remove: '/session/remove',
  goback: '/session/goback',
};

export const media = {
  generateAudio: '/media/audio/generate',
  generateVideo: '/media/video/generate',
  uploadBaseVideo: '/media/video/base/upload',
  stream: '/media/stream',
};
