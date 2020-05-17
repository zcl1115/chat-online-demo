<template>
  <div class="picker" v-if="isShow">
    <div v-for="(emoji,index) in emoji_list" v-bind:key="index">
      <div class="line" v-if="index%line_width === 0">
        <span v-for="i in line_width" v-bind:key="i" v-on:click="emoji_picked(index+i)">
          <span class="emoji" v-if="index+i < emoji_list.length">{{emoji_list[index+i]}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "emoji_picker",
  data() {
    return {
      top: 0,
      isShow: false,
      line_width: 8,
      // 找不到合适的资源，直接复制过来
      emoji_list: [
        "😀",
        "😁",
        "😂",
        "🤣",
        "😃",
        "😄",
        "😅",
        "😆",
        "😉",
        "😊",
        "😋",
        "😎",
        "😍",
        "😘",
        "🥰",
        "😗",
        "😙",
        "😚",
        "🙂",
        "🤗",
        "🤩",
        "🤔",
        "🤨",
        "😐",
        "😑",
        "😶",
        "🙄",
        "😏",
        "😣",
        "😥",
        "😮",
        "🤐",
        "😯",
        "😒",
        "😫",
        "😴",
        "😌",
        "😓",
        "😜",
        "😝",
        "🤤"
      ]
      //'😔', '😕', '🙃', '🤑', '😲', '✔️', '🙁', '😖', '😞', '😟', '😤', '😢',
      //'😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷',
      //'🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡', '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿',
      //'👹', '👺', '💀', '👻', '💫', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿'
    };
  },
  props: {
    inputData: {}
  },
  methods: {
    emoji_picked(index) {
      this.$emit("emoji_clicked", this.emoji_list[index]);
    }
  },
  watch: {
    inputData(newVal) {
      this.isShow = newVal;
    }
  }
};
</script>

<style scoped>
.picker {
  position: relative;
  width: fit-content;
  width: -moz-fit-content;
  border: 2px solid rgb(240, 240, 240);
  background: rgba(240, 240, 240, 0.3);
}
.emoji {
  margin-right: 5px;
  font-size: 20px;
}
</style>