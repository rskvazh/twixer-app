<script lang="ts">
  export let size = 128

  $: sizePx = `${size}px`
  $: fontSize = getFontSize(size)

  function getFontSize(size: number) {
    if (size <= 32) {
      return '26px'
    } else if (size <= 40) {
      return '30px'
    } else {
      return '90px'
    }
  }
</script>

<div
  class="pointer-events-none flex shrink-0 select-none items-center justify-center rounded-full bg-[#F2F2F5]"
  style:width={sizePx}
  style:height={sizePx}
  style:font-size={fontSize}
>
  <slot />
</div>
