/** 垃圾换生成器
 *  生成思路来源：https://github.com/menzi11/BullshitGenerator
*/
import loveLetter from './love_letter.json';

const { famous, bosh, after, before } = loveLetter;

// 一个很公平的洗牌算法 (x)
const knuthShuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
};

function *getWordRandom(array) {
  // 打乱数据
  const ret = knuthShuffle(array);
  for (let j = 0; j < ret.length; j++) {
    yield ret[j];
  }
}

const randomChoice = (array) => {
  const t = Math.floor(array.length * Math.random());
  return array[t];
};

//
export const moyatingGenerator = (title, size = 6000) => {
  let body = '';
  let famousList = getWordRandom(famous);
  let boshList = getWordRandom(bosh);
  while (body.length < size || body[body.length - 1] !== '。') {
    const act = Math.random() * 100;
    if (act < 5 && body[body.length - 1] === '。') {
      body += '\n';
    } else if (act < 20) {
      // 名人名言
      const r = famousList.next();
      if (r.done) {
        famousList = getWordRandom(famous);
      } else {
        body += r.value.replace('a', randomChoice(before))
          .replace('b', randomChoice(after));
        body = body.trim();
      }
    } else {
      const r = boshList.next();
      if (r.done) {
        boshList = getWordRandom(bosh);
      } else {
        body += r.value;
        body = body.trim();
      }
    }
  }
  return body.replace(/x/g, title);
};
