"use client";
import { FC, useCallback, useEffect } from "react";
import CustomNode from "./CustomNode";
import {
  addEdge,
  Background,
  ConnectionLineType,
  Controls,
  Edge,
  MarkerType,
  Node,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { XCircle } from "lucide-react";
import { mockCategories } from "@/lib/constants";
import { CustomNodeData } from "@/lib/types";

interface FoodExplorerGraphProps {}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

type CustomNode = {
  id: string;
  type: string;
  data: CustomNodeData;
  position: {
    x: number;
    y: number;
  };
};

const FoodExplorerGraph: FC<FoodExplorerGraphProps> = ({}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNodes = (
    parentNode: Node,
    newNodes: CustomNodeData[],
    offsetX: number = 200,
    offsetY: number = 0
  ) => {
    const x = (parentNode.position?.x || 0) + offsetX;
    const y =
      (parentNode.position?.y || 0) -
      ((newNodes.length - 1) * 60) / 2 +
      offsetY;

    console.log("add new nodes", Date.now().toLocaleString());
    // console.log(newNodes, "new nodes");
    // console.log(parentNode, "parent new node");

    // const createdNodes = newNodes

    let currentNodes = [] as Node[];
    setNodes((cur) => {
      currentNodes = [...cur];
      return currentNodes;
    });

    const createdNodes = newNodes
      // to filter out existing nodes to avoid creating duplicates
      .filter(
        (node) =>
          !currentNodes.some(
            (existingNode) =>
              // existingNode.id === `${parentNode.id}-${node.label}`
              existingNode.id === `${node.label}`
          )
      )
      .map((node, index) => ({
        // id: `${parentNode.id}-${node.label}`,
        id: `${node.label}`,
        type: "custom",
        data: node,
        position: { x, y: y + index * 60 },
      }));

    const newEdges = createdNodes.map((node) => ({
      id: `${parentNode.id}-${node.id}`,
      source: parentNode.id,
      target: node.id,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));

    console.log("new edges2", newEdges, Date.now().toLocaleString());

    // @ts-expect-error - fix this type error later
    setNodes((nds) => [...nds, ...createdNodes]);
    setEdges((eds) => {
      let filteredEdges = newEdges.filter(
        (edge) => !eds.some((existingEdge) => existingEdge.id === edge.id)
      );

      return [...eds, ...filteredEdges];
    });
  };

  const handleExploreClick = useCallback(() => {
    const categoryNodes = mockCategories.map((category) => ({
      label: category,
      type: "category" as const,
      onClick: () => handleCategoryClick(category),
      id: category,
      parentId: "start",
    }));
    let currentNodes = [] as Node[];
    setNodes((cur) => {
      currentNodes = [...cur];
      return currentNodes;
    });

    const startNode = currentNodes[0];
    if (startNode) {
      addNodes(startNode, categoryNodes);
    }
  }, [nodes]);

  const handleCategoryClick = useCallback(
    (category: string) => {
      let currentNodes = [] as Node[];
      setNodes((cur) => {
        currentNodes = [...cur];
        return cur;
      });

      const parentNode = currentNodes.find(
        (node) => node.data.label === category
      );

      const viewMealNode = currentNodes.find(
        (node) => node.data.label === "View Meals"
      );

      if (viewMealNode) {
        console.log("viewMealNode already added", viewMealNode);
        return;
      }
      console.log("parent node", parentNode, currentNodes, category);

      if (parentNode) {
        const childrenNodes = [
          {
            label: "View Meals",
            type: "option",
            id: "View Meals",
            parentId: category,
            onClick: () => {
              console.log("category", category);
              // handleViewMealsClick(category);
            },
          },
        ] as CustomNodeData[];
        addNodes(parentNode, childrenNodes, 100);
      }
    },
    [nodes]
  );

  useEffect(() => {
    setNodes([
      {
        id: "start",
        type: "custom",
        data: {
          label: "Explore",
          type: "explore",
          onClick: handleExploreClick,
        },
        position: { x: 100, y: 300 },
      },
    ]);
  }, []);

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
          // @ts-ignore
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {/* {showSidebar && (
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{selectedMeal}</h2>
            <button
              onClick={closeSidebar}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={24} />
            </button>
          </div>
          <p>{mockMealDetails}</p>
        </div>
      )} */}
    </div>
  );
};

export default FoodExplorerGraph;
