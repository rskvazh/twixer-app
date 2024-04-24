<script lang="ts">
  import { clipboardWriteText } from '$lib/clipboard'

  export let text: string
</script>

<div
  class="bg-bg-secondary text-default max-w-[90%] self-start whitespace-pre-line break-words rounded-2xl rounded-bl-none px-4 py-3 text-[17px] font-normal"
  on:click={() => clipboardWriteText(text)}
>
  {text}
</div>
