<template>
  <div class="warp">
    <div class="container">
      <div class="content-header">
        <h1>
          古诗文填空自动生成系统
        </h1>
        <div class="btn btn-block btn-primary FileUpload">上传文件<input type="file" @change="uploadFile" multiple></div>
      </div>

      <div class="content">
        <div class="box box-default" v-for="level in data">
          <div class="box-header with-border">
            <h3 class="box-title">{{level.name}}</h3>
          </div>

          <div class="box-body">
            <h4 v-if="level.poems && level.poems.length">古诗：</h4>
            <div v-for="poem in level.poems">
              <label>
                <input type="checkbox" v-model="poem.isSelect">
                <span>{{poem.name}}</span>
              </label>
            </div>

            <h4 v-if="level.articles && level.articles.length">古文：</h4>
            <div v-for="article in level.articles">
              <label>
                <input type="checkbox" v-model="article.isSelect">
                <span>{{article.name}}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="box box-default">
          <div class="box-header with-border">
            <h3 class="box-title">编辑：</h3>
          </div>

          <div class="box-body">
            <button class="btn btn-block btn-primary btn-flat" @click="generateRandomPoem('front')">
              前句填充古诗
            </button>
            <button class="btn btn-block btn-primary btn-flat" @click="generateRandomPoem('front', 'full')">
              前句填充全古诗
            </button>
            <button class="btn btn-block btn-primary btn-flat" @click="generateRandomPoem('back')">
              后句填充古诗
            </button>
            <button class="btn btn-block btn-primary btn-flat" @click="generateRandomPoem('back', 'full')">
              后句填充全古诗
            </button>
            <button class="btn btn-block btn-primary btn-flat" @click="generateRandomArticle()">
              随机抽取填充古文
            </button>
            <button class="btn btn-block btn-success btn-flat" @click="generatePaper()">
              自动生成考卷
            </button>
            <button class="btn btn-block btn-danger btn-flat" @click="clear()">
              清空
            </button>

            <div v-for="result in results" class="Editor">
              <div class="Editor__content">
                {{result.quest}}
              </div>
              <div class="Editor__button">
                <button>刷新</button>
              </div>
            </div>
          </div>
        </div>

        <div class="box box-default">
          <div class="box-header with-border">
            <h3 class="box-title">结果：</h3>
          </div>

          <div class="box-body">
            <textarea class="Result" v-model="output"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import constData from './assets/data'
  import * as helper from './helper'

  let data = [];

  try {
    data = helper.format(JSON.parse(localStorage.data));
  } catch (e) {
    data = helper.format(constData);
  }

  export default {
    data() {
      return {
        data,
        results: [],
        uploadFileLength: 0
      }
    },
    computed: {
      articles() {
        let articles = [];

        for (const level of this.data) {
          if (level.articles) {
            for (const article of level.articles) {
              articles.push(article);
            }
          }
        }

        return articles;
      },

      poems() {
        let poems = [];

        for (const level of this.data) {
          for (const poem of level.poems) {
            poems.push(poem);
          }
        }

        return poems;
      },

      output() {
        let output = '';

        for (const poem of this.results) {
          output += `${poem.quest}\r\n`;
        }

        return output;
      }
    },
    methods: {
      uploadFile(event) {
        let data = [];
        let i = 0;
        this.uploadFileLength = event.target.files.length;

        for (const file of event.target.files) {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            data.push(helper.formatTxt(file.name, reader.result));
            i++;

            if(this.uploadFileLength === i) {
              localStorage.data = JSON.stringify(data);
              window.location.reload();
            }
          };
        }
      },
      _getPoemQuest(poem, type) {
        let i = 1;
        const seed = Math.random();
        const step = 1 / poem.sentences.length;

        for (const sentence of poem.sentences) {
          const willUse = step * i > seed && step * (i - 1) < seed;

          // willUse是随机数选取当前句子是否被用
          if (willUse) {
            switch (type) {
              case 'front': {
                const index = 0;
                const blank = sentence[index].replace(/[\u4e00-\u9fa5]/g, '___');
                const sentenceWithoutHead = sentence.slice(1, sentence.length);
                const quest = [blank, ...sentenceWithoutHead].join('，');
                return `${quest}。`;
              }

              case 'back': {
                const index = sentence.length - 1;
                const blank = sentence[index].replace(/[\u4e00-\u9fa5]/g, '___');
                const sentenceWithoutEnd = sentence.slice(0, sentence.length - 1);
                const quest = [...sentenceWithoutEnd, blank].join('，');
                return `${quest}。`;
              }
            }
          }
          i++;
        }
      },

      _getPoemFullQuest(poem, type) {
        let quest = poem.content;

        for (const sentence of poem.sentences) {
          let index = 0;

          if (type === 'back') {
            index = sentence.length - 1;
          }

          const blank = sentence[index].replace(/[\u4e00-\u9fa5]/g, '___');
          quest = quest.replace(sentence[index], blank);
        }

        return quest;
      },

      generateRandomPoem(type, isFull) {
        // 计数器
        let i = 1;

        // 随机数种子
        const seed = Math.random();

        // 筛选出没有被用过，并且在选择范围内的古诗
        const selectedPoems = this.poems.filter(
          poem =>
          poem.isSelect &&
          !this.results.some(result => result.name === poem.name)
        );

        // 随机数范围阶数
        const step = 1 / selectedPoems.length;

        for (const poem of selectedPoems) {
          const willUse = step * i > seed && step * (i - 1) < seed;

          if (willUse) {
            this.results.push({
              ...poem,
              quest: isFull ? this._getPoemFullQuest(poem, type) : this._getPoemQuest(poem, type)
            });
            break;
          }

          i++;
        }
      },

      _getArticleQuest(article) {
        let i = 1;
        const articleSentences = [];
        article.quest = article.content;

        for (const sentence of article.sentences) {
          for (const block of sentence) {
            articleSentences.push(block);
          }
        }

        for (const sentence of articleSentences) {
          const willUse = Math.random() > 0.5;

          // willUse是随机数选取当前句子是否被用
          if (willUse) {
            const blank = sentence.replace(/[\u4e00-\u9fa5]/g, '___');
            article.quest = article.quest.replace(sentence, blank);
          }
          i++;
        }

        return article.quest;
      },

      generateRandomArticle() {
        // 计数器
        let i = 1;

        // 随机数种子
        const seed = Math.random();

        // 筛选出没有被用过，并且在选择范围内的古文
        const selectedArticles = this.articles.filter(
          article =>
          article.isSelect &&
          !this.results.some(result => result.name === article.name)
        );

        // 随机数范围阶数
        const step = 1 / selectedArticles.length;

        for (const article of selectedArticles) {
          const willUse = step * i > seed && step * (i - 1) < seed;

          if (willUse) {
            this.results.push({
              ...article,
              quest: this._getArticleQuest(article)
            });
            break;
          }

          i++;
        }
      },

      clear() {
        this.results = [];
      }
    }
  }
</script>

<style>
  .warp {
    background-color: #ecf0f5;
    min-height: 100vh;
    min-width: 100vw;
  }

  .Result {
    width: 100%;
    height: 300px;
  }

  .btn.btn-block {
    display: inline;
    width: auto;
    margin-top: 0;
  }

  .Editor {
    display: table;
    padding: 10px 0;
    width: 100%;
    border-bottom: 1px solid #cccccc;
  }

  .Editor:last-child {
    border-bottom: 0;
  }

  .Editor__content {
    width: 80%;
    display: table-cell;
    vertical-align: middle;
  }

  .Editor__button {
    width: 20%;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  .FileUpload {
    position: absolute;
    bottom: 0;
    left: 300px;
    width: 100px;
    text-align: center;
    cursor: pointer;
  }

  .FileUpload > input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
</style>
