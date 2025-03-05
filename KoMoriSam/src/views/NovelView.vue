<template>
  <div class="flex flex-col lg:flex-row items-center gap-5 lg:gap-10">
    <div>
      <p>
        <button class="btn w-20 m-2">当前</button>
        <select class="select m-2">
          <option disabled selected>未选择章节</option>
          <option>Crimson</option>
          <option>Amber</option>
          <option>Velvet</option>
        </select>
      </p>
      <p>
        <button class="btn w-20 m-2">最新</button>
        <select class="select m-2">
          <option disabled selected>最新章节</option>
        </select>
      </p>
      <button class="btn btn-primary m-2">返回首章</button>
      <button class="btn btn-primary m-2">上一章</button>
      <button class="btn btn-primary m-2">下一章</button>
      <button class="btn btn-primary m-2">最新章节</button>
    </div>
    <div class="divider lg:divider-horizontal"></div>
    <article class="prose lg:prose-xl">
      <h1>你好！</h1>
      <p>
        这里是 KoMoriSam 的网站
        <br />在这里我会分享一些正在做的项目 <br />另外还有我写的一点小东西捏
      </p>
    </article>
  </div>
</template>
