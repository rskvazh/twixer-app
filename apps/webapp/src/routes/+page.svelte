<script lang="ts">
  import { apiCurrentUser } from '$lib/api'
  import SignUp from './SignUp.svelte'
  import Home from './Home.svelte'
</script>

{#if $apiCurrentUser}
  {#if $apiCurrentUser.isRegistered}
    <Home />
  {:else}
    <SignUp />
  {/if}
{/if}
