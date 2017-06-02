<template>
  <div class="warp">
    <div class="container">
      <div class="content-header">
        <h1>古诗文填空自动生成系统</h1>
      </div>

      <div class="content">
        <div class="box box-default" v-for="level in data">
          <div class="box-header with-border">
            <h3 class="box-title">{{level.name}}</h3>
          </div>

          <div class="box-body">
            <div v-for="poem in level.poems">
              <label>
                <input type="checkbox" v-model="poem.isSelect">
                <span>{{poem.name}}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="box box-default">
          <div class="box-header with-border">
            <h3 class="box-title">结果：</h3>
          </div>

          <div class="box-body">
            <textarea class="Result" v-model="output"></textarea>
            <button @click="generate('front')">生成前句填充</button>
            <button @click="generate('back')">生成后句填充</button>
            <button @click="generate('mixin')">生成混合填充</button>
            <button @click="clear()">清空</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import constData from './assets/data'
import * as helper from './helper'

let data = helper.format(constData);

export default {
  data() {
    return {
      data,
      result: []
    }
  },
  computed: {
    poems() {
      let poems = [];

      for(const level of this.data) {
        for(const poem of level.poems) {
          poems.push(poem);
        }
      }

      return poems;
    },

    output() {
      let output = '';

      for(const poem of this.result) {
        output += `${poem.quest}\r\n`;
      }

      return output;
    }
  },
  methods: {
    _getPoemQuest(poem, options) {
      let i = 1;
      const seed = Math.random();
      const step = 1 / poem.sentences.length;

      for(const sentence of poem.sentences) {
        const willUse = step * i > seed;

        // willUse是随机数选取当前句子是否被用
        if(willUse) {
          switch (options.dir) {
            case 'front': {
              const blank = sentence[0].replace(/[\u4e00-\u9fa5]/g, '___');
              const quest = [blank, sentence[1]].join('，');
              return `${quest}。`;
            }

            case 'back':{
              const blank = sentence[1].replace(/[\u4e00-\u9fa5]/g, '___');
              const quest = [sentence[0], blank].join('，');
              return `${quest}。`;
            }
          }
        }
        i++;
      }
    },
    generate(type) {
      let options = {};
      switch(type) {
        case 'front':
          options.maxSentenceLength = 2;
          options.dir = 'front';
          break;
        case 'back':
          options.maxSentenceLength = 2;
          options.dir = 'back';
          break;
        case 'mixin':
          options.maxSentenceLength = Infinity;
          options.dir = 'mixin';
          return;
      }

      for(const poem of this.poems) {
        const isPoemUsed = this.result.some(result => result.name === poem.name);
//        const willUse = poem.isSelect ? true : Math.random() > 0.5;
        const willUse = poem.isSelect;

        // 判断是否需要选择该古诗，如果古诗已被选用则跳过
        if(!isPoemUsed && willUse) {
          this.result.push({
            ...poem,
            quest: this._getPoemQuest(poem, options)
          });
          break;
        }
      }
    },

    clear() {
      this.result = [];
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
</style>
