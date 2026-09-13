<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte";
  import { MessagesSquare } from "@lucide/svelte";

  let {
    data,
    selected,
  }: {
    data: { label?: string; detail?: string };
    selected?: boolean;
  } = $props();
</script>

<div class="studio-node studio-node--response" class:selected>
  <div class="studio-node__icon studio-node__icon--green">
    <MessagesSquare class="size-4" />
  </div>
  <div class="studio-node__body">
    <span class="studio-node__label">OUTPUT</span>
    <strong class="studio-node__title"
      >{data.label || "Reply to customer"}</strong
    >
    <span class="studio-node__meta">{data.detail || "No message set"}</span>
  </div>
  <Handle type="target" position={Position.Left} class="studio-handle" />
</div>
