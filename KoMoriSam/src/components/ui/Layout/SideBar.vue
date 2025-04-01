<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-start justify-start">
      <main
        class="flex flex-col md:flex-row h-full md:w-[90%] m-8 lg:m-12 items-start justify-center md:justify-between gap-5"
      >
        <slot name="content"></slot>
      </main>
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer-2"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul
        class="menu bg-base-200 text-base-content min-h-full m-0 p-4 w-80 items-center"
      >
        <aside class="flex-1 flex flex-col lg:sticky lg:top-12">
          <slot name="aside"></slot>
        </aside>
      </ul>
    </div>
  </div>
</template>
