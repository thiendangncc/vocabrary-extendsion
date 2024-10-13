const URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&hl=en-US&dt=t&dt=bd&dj=1&source=ls&tk=243192.243192&q=`;
export const translateVn = (text: string) => {
  return fetch(URL + text, {
    method: "GET",
  })
    .then((r) => r.json())
    .then((r) => {
      if (!r?.sentences?.length) return "";
      return r.sentences[0].trans;
    });
};

export const textToSpeech = (text: string) => {
  return fetch(
    `https://translate-pa.googleapis.com/v1/textToSpeech?client=gtx&language=en&text=${text}&voice_speed=1&key=AIzaSyDLEeFI5OtFBwYBIoK_jj5m32rZK5CkCXA`,
    {
      method: "GET",
    }
  )
    .then((r) => r.json())
    .then((r) => {
      return r.audioContent;
    });
};
