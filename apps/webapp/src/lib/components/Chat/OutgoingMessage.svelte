<script lang="ts">
  import { clipboardWriteText } from '$lib/clipboard'

  export let text: string
</script>

<div
  class="bg-accent max-w-[90%] self-end whitespace-pre-line break-words rounded-2xl rounded-br-none px-4 py-3 text-[17px] font-normal text-white"
  on:click={() => clipboardWriteText(text)}
>
  {text}
</div>
