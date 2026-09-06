<script lang="ts">
  import { page } from "$app/state";
  import TeamMemberPage from "../../../../pages/TeamMemberPage.svelte";
</script>

<TeamMemberPage memberId={page.params.id || ""} />
