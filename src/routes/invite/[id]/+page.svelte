<script lang="ts">
  import { page } from "$app/state";
  import AcceptInvitePage from "../../../pages/AcceptInvitePage.svelte";
</script>

<AcceptInvitePage inviteId={page.params.id || ""} />
