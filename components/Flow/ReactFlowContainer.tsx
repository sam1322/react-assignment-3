"use client";
import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Image from "next/image";
import { useCallback } from "react";
import ExploreNode from "./ExploreNode";
const ReactFlowContainer = ({}) => {
  const nodeTypes = {
    exploreNode: ExploreNode,
  };
  const initialNodes = [
    {
      id: "1",
      position: { x: 100, y: 300 },
      data: {
        // label: newId,
        // nodeType: type,
        // onDeleteNode: onDeleteNode,
      },
      type: "exploreNode",
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-[80%]">
      <div className="w-full flex flex-start pb-2">Food Explorer</div>

      <div className="bg-zinc-200 p-4 h-[900px] w-full ">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // nodes={historyNodes ?? nodes}
          // edges={historyEdges ?? edges}
          // onNodesChange={handleNodesChange}
          // onEdgesChange={handleEdgesChange}
          // onConnect={handleConnect}
          // @ts-ignore
          nodeTypes={nodeTypes}
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ReactFlowContainer;
