const chinesePunctuation = /[。|？|！|。”|？”|！”]+/g;

export const format = data => {
  let formatData = data;

  // 遍历年级
  for(let level of formatData) {
    level.isSelect = false;

    // 遍历古诗
    for(let poem of level.poems) {

      const sentences = poem.content
        // 去掉尾句标点符号
        .replace(/。$|？$|！$/g, '')
        // 拆分句子
        .split('。');

      poem.sentences = [];
      poem.isSelect = true;

      // 遍历古诗的每一句句子
      for(let sentence of sentences) {
        const blocks = sentence.split('，');
        poem.sentences.push(blocks);
      }
    }

    if(level.articles) {
      // 遍历古文
      for(let article of level.articles) {
        let sentences = article.content.replace(/。$|？$|！$|。”$|？”$|！”$/g, '').split(/[。|？|！|。”|？”|！”]+/g);

        article.isSelect = true;
        article.sentences = [];

        for(let sentence of sentences) {
          let blocks = sentence.split('，');
          // 去掉对话主语，例如曹刿论战
          blocks = blocks.map(
            block => block.trim().replace(/^[\u4e00-\u9fa5]*：“/g, '')
          );
          article.sentences.push(blocks);
        }
      }
    }
  }

  console.log('>>>>>>输入格式化的考试数据：', formatData);

  return formatData;
};
