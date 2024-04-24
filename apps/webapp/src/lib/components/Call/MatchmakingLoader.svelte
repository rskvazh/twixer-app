<script lang="ts">
  import Twirl from '$lib/assets/Twirl.svelte'
  import { tr } from '$lib/i18n'
</script>

<div class="text-accent flex flex-col items-center justify-between p-11 text-[17px] font-medium">
  <div class="animate-spin will-change-transform"><Twirl /></div>
  <div>{$tr('finding_someone')}</div>
</div>
