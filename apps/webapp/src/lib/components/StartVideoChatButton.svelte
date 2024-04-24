<script lang="ts">
  import VideoChatIcon from '$lib/assets/VideoChatIcon.svelte'
  import { tr } from '$lib/i18n'
  import Button from './Button.svelte'
</script>

<Button on:click>
  <VideoChatIcon slot="icon" />
  {$tr('start_video_chat')}
</Button>
