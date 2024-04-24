<script lang="ts">
  import FullAvatar from '$lib/components/FullAvatar.svelte'
</script>

<div class="flex max-w-[70%] items-center gap-2 rounded-[30px] bg-black/30 p-1 pr-6">
  <FullAvatar size={32}>🐼</FullAvatar>
  <div class="flex flex-col">
    <div class="line-clamp-1 text-ellipsis text-[13px] font-medium text-white">
      Emily GeogettaGeogetta
    </div>
    <div class="line-clamp-1 text-ellipsis text-[11px] font-medium text-white">Channel</div>
  </div>
</div>
