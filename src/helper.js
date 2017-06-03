const chinesePunctuation = /[。|？|！|。”|？”|！”]+/g;

export const formatTxt = (name, txt) => {
  let poems = [];
  let articles = [];

  let poemsTxt = txt.split('古文：')[0];

  if (poemsTxt) {
    poemsTxt = poemsTxt
      .replace('古诗：', '')
      .trim().replace(/\s{2,}/g, '\r\n\r\n')
      .split('\r\n\r\n');

    for(const poemTxt of poemsTxt) {
      const name = poemTxt.split(/\s+/)[0];
      const content = poemTxt.replace(name, '').trim();

      poems.push({name, content});
    }
  }

  let articlesTxt = txt.split('古文：')[1];

  if (articlesTxt) {
    articlesTxt = articlesTxt
      .replace('古文：', '')
      .trim().replace(/\s{2,}/g, '\r\n\r\n')
      .split('\r\n\r\n');

    for(const articleTxt of articlesTxt) {
      const name = articleTxt.split(/\s+/)[0];
      const content = articleTxt.replace(name, '').trim();

      articles.push({name, content});
    }
  }

  return {
    name,
    poems,
    articles
  }
};

export const format = data => {
  let formatData = data;

  // 遍历年级
  for (let level of formatData) {
    level.isSelect = false;

    // 遍历古诗
    for (let poem of level.poems) {

      const sentences = poem.content
      // 去掉尾句标点符号
        .replace(/。$|？$|！$/g, '')
        // 拆分句子
        .split('。');

      poem.sentences = [];
      poem.isSelect = true;

      // 遍历古诗的每一句句子
      for (let sentence of sentences) {
        const blocks = sentence.split('，');
        poem.sentences.push(blocks);
      }
    }

    if (level.articles) {
      // 遍历古文
      for (let article of level.articles) {
        let sentences = article.content.replace(/。$|？$|！$|。”$|？”$|！”$/g, '').split(/[。|？|！|。”|？”|！”]+/g);

        article.isSelect = true;
        article.sentences = [];

        for (let sentence of sentences) {
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
