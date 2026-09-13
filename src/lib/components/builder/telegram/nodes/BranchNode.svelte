<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte";
  import { GitBranch } from "@lucide/svelte";

  let {
    data,
    selected,
  }: {
    data: { label?: string; conditionA?: string; conditionB?: string };
    selected?: boolean;
  } = $props();
</script>

<div class="studio-node studio-node--branch" class:selected>
  <div class="studio-node__icon studio-node__icon--blue">
    <GitBranch class="size-4" />
  </div>
  <div class="studio-node__body">
    <span class="studio-node__label">BRANCH</span>
    <strong class="studio-node__title">{data.label || "Condition split"}</strong
    >
    <div class="branch-routes">
      <span class="branch-route branch-route--a">
        <span class="branch-dot"></span>{data.conditionA || "True path"}
        <Handle
          type="source"
          id="a"
          position={Position.Right}
          class="studio-handle studio-handle--a"
        />
      </span>
      <span class="branch-route branch-route--b">
        <span class="branch-dot"></span>{data.conditionB || "False path"}
        <Handle
          type="source"
          id="b"
          position={Position.Right}
          class="studio-handle studio-handle--b"
        />
      </span>
    </div>
  </div>
  <Handle type="target" position={Position.Left} class="studio-handle" />
</div>
