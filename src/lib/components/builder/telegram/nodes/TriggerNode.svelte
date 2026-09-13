<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte";
  import { Zap } from "@lucide/svelte";

  let {
    data,
    selected,
  }: {
    data: { command?: string; description?: string };
    selected?: boolean;
  } = $props();
</script>

<div class="studio-node studio-node--trigger" class:selected>
  <div class="studio-node__icon studio-node__icon--yellow">
    <Zap class="size-4" />
  </div>
  <div class="studio-node__body">
    <span class="studio-node__label">TRIGGER</span>
    <strong class="studio-node__title">Telegram message</strong>
    <span class="studio-node__meta">{data.command || "Any message"}</span>
  </div>
  <Handle type="source" position={Position.Right} class="studio-handle" />
</div>
