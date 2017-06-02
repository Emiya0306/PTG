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

let data = constData;

data = data.map((level) => {

  level.poems = level.poems.map((poem) => {
    poem.isSelect = false;
    return poem;
  });

  return level;
});

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
    generate(type) {
      for(const poem of this.poems) {
        const isPoemUsed = this.result.some(result => result.name === poem.name);
        const isNewInsert = this.result.every(result => result.name !== poem.name);
//        const isPoemSuitable = poem;

        if(poem.isSelect === true && !isPoemUsed) {
//          const quest = poem.content;
          this.result.push({...poem, quest: poem.content});
          if(isNewInsert) return;
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
