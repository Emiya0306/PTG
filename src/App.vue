<template>
  <div>
    <h1>Hello world!</h1>

    <div v-for="level in data">
      <h2>{{level.name}}</h2>
      <div v-for="poem in level.poems">
        <label>
          <input type="checkbox" v-model="poem.isSelect">
          <span>{{poem.name}}</span>
        </label>
      </div>
    </div>

    <div>
      <textarea class="Result" v-model="result"></textarea>
      <button @click="generateTest">生成</button>
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
      result: ''
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
    }
  },
  methods: {
    generateTest() {
      this.result = '';

      for(const poem of this.poems) {
        if(poem.isSelect === true) {
          this.result = `${this.result}\r\n${poem.content}`
        }
      }
    }
  }
}
</script>

<style>
  .Result {
    width: 100%;
    height: 300px;
  }
</style>
