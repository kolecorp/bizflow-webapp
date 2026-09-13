<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { Zap } from '@lucide/svelte';

  let { data, selected } = $props<{
    data: { 
      label: string;
      description?: string;
      iconType?: string;
      outputs?: number;
    };
    selected?: boolean;
  }>();
</script>

<div class="studio-node" class:selected>
  <div class="node-header">
    <div class="node-icon-box">
      <Zap class="size-4" style="color:var(--primary-foreground)" />
    </div>
    <div class="node-status-dot"></div>
  </div>
  
  <div class="node-body">
    <h3 class="node-title">{data.label}</h3>
    {#if data.description}
      <p class="node-desc">{data.description}</p>
    {/if}
  </div>

  <div class="node-footer">
    <div class="output-pill">
      <span class="check-icon">✓</span>
      {data.outputs || 1} output
    </div>
  </div>

  <Handle type="source" position={Position.Right} class="studio-handle" />
</div>

<style>
  .studio-node {
    display: flex;
    flex-direction: column;
    width: 220px;
    background: var(--card);
    border: 1.5px solid color-mix(in srgb, var(--primary) 30%, var(--border));
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    cursor: grab;
  }

  .studio-node.selected {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 20%, transparent), 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .node-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .node-icon-box {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .node-status-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--primary);
    border: 3px solid var(--card);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .node-status-dot::after {
    content: "✓";
    color: var(--card);
    font-size: 8px;
    font-weight: bold;
  }

  .node-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--foreground);
    margin: 0 0 4px 0;
  }

  .node-desc {
    font-size: 12px;
    color: var(--muted-foreground);
    margin: 0 0 12px 0;
    line-height: 1.4;
  }

  .node-footer {
    display: flex;
    align-items: center;
  }

  .output-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--muted) 50%, transparent);
    border: 1px solid var(--border);
    font-size: 10px;
    font-weight: 500;
    color: var(--foreground);
  }

  .check-icon {
    color: var(--primary);
  }

  :global(.studio-handle) {
    width: 10px;
    height: 10px;
    background: var(--card);
    border: 2px solid var(--primary);
    border-radius: 50%;
  }
</style>
