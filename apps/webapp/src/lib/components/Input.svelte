<script lang="ts">
  export let placeholder = ''
  export let value = ''

  let el: HTMLInputElement

  export function focus() {
    el.focus()
  }

  function onBlur() {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
</script>

<input
  {placeholder}
  on:click
  bind:this={el}
  bind:value
  class="bg-bg-secondary text-default placeholder:text-default h-[52px] w-full rounded-[20px] px-4 text-[17px] font-medium"
/>
