<button
  class="bg-bg-secondary flex cursor-pointer select-none items-center gap-4 rounded-2xl px-4 py-[14px] text-[17px] font-medium active:brightness-90"
  on:click
>
  <slot name="left" />

  <div class="grow text-left">
    <slot />
  </div>

  <slot name="right" />

  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" viewBox="0 0 12 20" fill="none">
      <path
        d="M1.5 1.5L10 10L1.5 18.5"
        stroke="#AFAFB6"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
  </div>
</button>
