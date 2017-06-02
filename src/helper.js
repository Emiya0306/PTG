export const format = data => {
  let formatData = data;

  // 遍历年级
  for(let level of formatData) {
    level.isSelected = false;

    // 遍历古诗
    for(let poem of level.poems) {
      poem.isSelected = false;
      const sentences = poem.content.replace(/。$|？$/g, '').split('。');
      poem.sentences = [];

      // 遍历古诗的每一句句子
      for(let sentence of sentences) {
        const block = sentence.split('，');
        poem.sentences.push(block);
      }
    }
  }

  console.log('>>>>>>输入格式化的考试数据：', formatData);

  return formatData;
};
