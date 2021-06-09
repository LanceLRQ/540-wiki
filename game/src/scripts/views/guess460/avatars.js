import { get } from 'lodash';

export const AvatarFumei = [
  '01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png',
  '10.png', '11.png', '12.png', '13.png', '14.png', '15.png'
];

export const buildAvatarPath = (key) => {
  if (key.indexOf('p:') === 0) {
    const keys = key.split(':');
    return `/static/avatars/${get(keys, '1', 'fumei')}/${get(keys, '2', '07.png')}`;
  }
  return key;
};
