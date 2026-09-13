<script lang="ts">
  import {
    SvelteFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
  } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import TriggerNode from "./nodes/TriggerNode.svelte";
  import LogicNode from "./nodes/LogicNode.svelte";
  import ActionNode from "./nodes/ActionNode.svelte";
  import ResponseNode from "./nodes/ResponseNode.svelte";
  import AINode from "./nodes/AINode.svelte";
  import BranchNode from "./nodes/BranchNode.svelte";

  let {
    nodes = $bindable([]),
    edges = $bindable([]),
    onNodeClick,
  } = $props<{
    nodes: any[];
    edges: any[];
    onNodeClick?: (node: any) => void;
  }>();

  const nodeTypes = {
    trigger: TriggerNode,
    logic: LogicNode,
    action: ActionNode,
    response: ResponseNode,
    ai: AINode,
    branch: BranchNode,
  };

  const defaultEdgeOptions = {
    type: "smoothstep",
    animated: true,
    style: "stroke: var(--primary); stroke-width: 2; stroke-opacity: 0.7;",
  };

  const proOptions = { hideAttribution: true };
</script>

<div class="vb-root">
  <SvelteFlow
    minZoom={0.35}
    maxZoom={1.8}
    bind:nodes
    bind:edges
    {nodeTypes}
    {defaultEdgeOptions}
    {proOptions}
    fitView
    fitViewOptions={{ padding: 0.22, maxZoom: 0.9 }}
    onnodeclick={(e) => onNodeClick?.(e.detail.node)}
  >
    <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
    <Controls position="bottom-left" />
    <MiniMap
      position="bottom-right"
      maskColor="color-mix(in srgb, var(--background) 70%, transparent)"
      nodeColor="var(--primary)"
    />
  </SvelteFlow>
</div>

<style>
  /* ─── wrapper ─── */
  .vb-root {
    width: 100%;
    height: 100%;
    --vb-dot: color-mix(in srgb, var(--muted-foreground) 35%, transparent);
  }

  /* ─── override Svelte Flow defaults to respect our theme ─── */
  :global(.svelte-flow) {
    background: transparent;
  }
  :global(.svelte-flow .svelte-flow__background) {
    background: transparent;
  }

  /* ─── node shell shared by every node ─── */
  :global(.studio-node) {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    width: 320px;
    min-width: 320px;
    min-height: 112px;
    padding: 1.15rem 1.25rem;
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 1rem;
    box-shadow: 0 4px 16px color-mix(in srgb, var(--foreground) 8%, transparent);
    transition:
      border-color 150ms ease,
      box-shadow 180ms ease,
      transform 150ms ease;
    cursor: pointer;
    position: relative;
  }
  :global(.studio-node:hover),
  :global(.studio-node.selected) {
    border-color: var(--primary);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent),
      0 6px 24px color-mix(in srgb, var(--foreground) 12%, transparent);
    transform: translateY(-1px);
  }
  :global(.studio-node--trigger) {
    border-color: color-mix(in srgb, #facc15 40%, var(--border));
  }
  :global(.studio-node--trigger:hover),
  :global(.studio-node--trigger.selected) {
    border-color: #facc15;
    box-shadow:
      0 0 0 3px color-mix(in srgb, #facc15 20%, transparent),
      0 6px 24px color-mix(in srgb, var(--foreground) 12%, transparent);
  }
  :global(.studio-node--response) {
    border-color: color-mix(in srgb, #22c55e 40%, var(--border));
  }
  :global(.studio-node--response:hover),
  :global(.studio-node--response.selected) {
    border-color: #22c55e;
    box-shadow:
      0 0 0 3px color-mix(in srgb, #22c55e 20%, transparent),
      0 6px 24px color-mix(in srgb, var(--foreground) 12%, transparent);
  }
  :global(.studio-node--branch) {
    border-color: color-mix(in srgb, var(--primary) 40%, var(--border));
    flex-direction: column;
  }
  :global(.studio-node--branch:hover),
  :global(.studio-node--branch.selected) {
    border-color: var(--primary);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent),
      0 6px 24px color-mix(in srgb, var(--foreground) 12%, transparent);
  }

  /* ─── icon pill ─── */
  :global(.studio-node__icon) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.65rem;
  }
  :global(.studio-node__icon--yellow) {
    background: color-mix(in srgb, #facc15 18%, transparent);
    color: #ca8a04;
  }
  :global(.studio-node__icon--violet) {
    background: color-mix(in srgb, #a855f7 18%, transparent);
    color: #9333ea;
  }
  :global(.studio-node__icon--orange) {
    background: color-mix(in srgb, #f97316 18%, transparent);
    color: #ea580c;
  }
  :global(.studio-node__icon--green) {
    background: color-mix(in srgb, #22c55e 18%, transparent);
    color: #16a34a;
  }
  :global(.studio-node__icon--pink) {
    background: color-mix(in srgb, #ec4899 18%, transparent);
    color: #db2777;
  }
  :global(.studio-node__icon--blue) {
    background: color-mix(in srgb, var(--primary) 18%, transparent);
    color: var(--primary);
  }

  /* ─── text content ─── */
  :global(.studio-node__body) {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
    flex: 1;
  }
  :global(.studio-node__label) {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: var(--muted-foreground);
    text-transform: uppercase;
  }
  :global(.studio-node__title) {
    font-size: 1rem;
    font-weight: 700;
    color: var(--foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :global(.studio-node__meta) {
    font-size: 0.78rem;
    color: var(--muted-foreground);
    font-family: var(--font-mono, monospace);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ─── handles ─── */
  :global(.svelte-flow__handle.studio-handle) {
    width: 14px;
    height: 14px;
    background: var(--primary);
    border: 3px solid var(--card);
    border-radius: 50%;
    transition:
      transform 150ms ease,
      background 150ms ease;
  }
  :global(.svelte-flow__handle.studio-handle:hover) {
    transform: scale(1.4);
    background: color-mix(in srgb, var(--primary) 80%, white);
  }
  :global(.svelte-flow__handle.studio-handle--a) {
    top: calc(33% - 5px) !important;
    background: #22c55e;
  }
  :global(.svelte-flow__handle.studio-handle--b) {
    top: calc(67% - 5px) !important;
    background: #f97316;
  }

  /* ─── branch rows ─── */
  :global(.branch-routes) {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: 0.45rem;
    padding-top: 0.45rem;
    border-top: 1px solid var(--border);
    position: relative;
  }
  :global(.branch-route) {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    padding-right: 1rem;
    position: relative;
  }
  :global(.branch-dot) {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  :global(.branch-route--a .branch-dot) {
    background: #22c55e;
  }
  :global(.branch-route--b .branch-dot) {
    background: #f97316;
  }

  /* ─── flow edges ─── */
  :global(.svelte-flow__edge-path) {
    stroke: var(--primary);
    stroke-width: 2;
    stroke-opacity: 0.65;
  }
  :global(.svelte-flow__edge.selected .svelte-flow__edge-path) {
    stroke-opacity: 1;
    stroke-width: 2.5;
  }

  /* ─── minimap & controls ─── */
  :global(.svelte-flow__minimap) {
    bottom: 96px !important;
    border: 1px solid var(--border);
    border-radius: 0.6rem;
    overflow: hidden;
    background: var(--card) !important;
  }
  :global(.svelte-flow__controls) {
    bottom: 96px !important;
    border: 1px solid var(--border);
    border-radius: 0.6rem;
    overflow: hidden;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--foreground) 8%, transparent);
  }
  :global(.svelte-flow__controls button) {
    background: var(--card);
    border: 0;
    border-bottom: 1px solid var(--border);
    color: var(--foreground);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :global(.svelte-flow__controls button:hover) {
    background: var(--muted);
  }
  :global(.svelte-flow__controls button:last-child) {
    border-bottom: 0;
  }
</style>
