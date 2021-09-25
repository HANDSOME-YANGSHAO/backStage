<template>
  <div class="icons">
    <a href="https://github.com/HANDSOME-YANGSHAO" target="_blank">
      <div class="layer">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span class="icon"><img src="~assets/img/home/github.svg" alt=""></span>
      </div>
      <span class="text">github</span>
    </a>
    <a href="javascript:alert('如果有什么想要交流的地方这是我的微信号，欢迎大佬们指正！：abc19823319896');">
      <div class="layer">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span class="icon"><img src="~assets/img/home/WECHAT.svg" alt=""></span>
      </div>
      <span class="text">Wechat</span>
    </a>
    <a href="https://juejin.cn/user/3457279027065287" target="_blank">
      <div class="layer">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span class="icon"><img src="~assets/img/home/JUEJIN.svg" alt=""></span>
      </div>
      <span class="text">JUEJIN</span>
    </a>
    <a href="http://101.34.32.63/supermall" target="_blank">
      <div class="layer">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span class="icon"><img src="~assets/img/home/SHOP.svg" alt=""></span>
      </div>
      <span class="text">supermall</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Info'
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

html,
body {
  display: grid;
  height: 100%;
  place-items: center;
  background: #000;
}

.icons {
  display: inline-flex;
}

.icons a {
  margin: 0 25px;
  text-decoration: none;
  color: #fff;
  display: block;
  position: relative;
}

.icons a .layer {
  width: 55px;
  height: 55px;
  transition: transform 0.3s;
}

.icons a:hover .layer {
  transform: rotate(-35deg) skew(20deg);
}

.icons a .layer span {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: 1px solid #fff;
  border-radius: 5px;
  transition: all 0.3s;
}

.icons a .layer span.icon {
  font-size: 30px;
  line-height: 55px;
  text-align: center;
  img {
    width: 60%;
    height: 60%;
  }
}

.icons a:hover .layer span:nth-child(1) {
  opacity: 0.2;
}

.icons a:hover .layer span:nth-child(2) {
  opacity: 0.4;
  transform: translate(5px, -5px);
}

.icons a:hover .layer span:nth-child(3) {
  opacity: 0.6;
  transform: translate(10px, -10px);
}

.icons a:hover .layer span:nth-child(4) {
  opacity: 0.8;
  transform: translate(15px, -15px);
}

.icons a:hover .layer span:nth-child(5) {
  opacity: 1;
  transform: translate(20px, -20px);
}

.icons a:nth-child(1) .layer span,
.icons a:nth-child(1) .text {
  color: #4267b2;
  border-color: #4267b2;
}

.icons a:nth-child(2) .layer span,
.icons a:nth-child(2) .text {
  color: rgb(36,219,90);
  border-color: rgb(36,219,90);
}

.icons a:nth-child(3) .layer span,
.icons a:nth-child(3) .text {
  color: rgb(29,34,53);
  border-color: rgb(29,34,53);
}

.icons a:nth-child(4) .layer span,
.icons a:nth-child(4) .text {
  color: rgb(234,81,72);
  border-color: rgb(234,81,72);
}


.icons a:nth-child(1) .layer span {
  box-shadow: -1px 1px 3px #4267b2;
}

.icons a:nth-child(2) .layer span {
  box-shadow: -1px 1px 3px rgb(36,219,90);;
}

.icons a:nth-child(3) .layer span {
  box-shadow: -1px 1px 3px rgb(29,34,53);
}

.icons a:nth-child(4) .layer span {
  box-shadow: -1px 1px 3px rgb(234,81,72);
}


.icons a .text {
  position: absolute;
  left: 50%;
  bottom: -5px;
  opacity: 0;
  transform: translateX(-50%);
  transition: bottom 0.3s ease, opacity 0.3s ease;
}

.icons a:hover .text {
  bottom: -35px;
  opacity: 1;
}
</style>
