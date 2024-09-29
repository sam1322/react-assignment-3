// "use client";
// import {
//   addEdge,
//   Background,
//   Controls,
//   ReactFlow,
//   useEdgesState,
//   useNodesState,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import Image from "next/image";
// import { useCallback } from "react";

// import ExploreNode from "./ExploreNode";

// const mockCategories = ['Pasta', 'Chicken', 'Dessert', 'Seafood', 'Vegan'];
// const mockMeals = {
//   Seafood: ['Escovitch Fish', 'Cajun spiced fish tacos', 'Baked salmon with fennel & tomatoes', 'Fish fofos', 'Grilled Portuguese sardines'],
// };
// const mockIngredients = ['Fennel', 'Parsley', 'Salmon', 'Lemon', 'Tomato'];
// const mockTags = ['Healthy', 'Quick', 'Seafood', 'Baked', 'Mediterranean'];
// const mockMealDetails = 'Baked salmon with fennel & tomatoes is a delicious and healthy Mediterranean-inspired dish.';

// const ReactFlowContainer = ({}) => {
//   const initialNodes = [
//     {
//       id: "1",
//       position: { x: 100, y: 300 },
//       data: {
//         // label: newId,
//         // nodeType: type,
//         // onDeleteNode: onDeleteNode,
//       },
//       type: "exploreNode",
//     },
//   ];

//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const nodeTypes = {
//     exploreNode: ExploreNode,
//   };

//   const handleExploreClick = useCallback(() => {
//     const categoryNodes = mockCategories.map((category) => ({
//       label: category,
//       type: 'category' as const,
//       onClick: () => handleCategoryClick(category),
//     }));
//     addNodes(nodes[0], categoryNodes);
//   }, [nodes]);

//   const handleCategoryClick = useCallback((category: string) => {
//     const parentNode = nodes.find((node) => node.data.label === category);
//     if (parentNode) {
//       addNodes(parentNode, [{ label: 'View Meals', type: 'option', onClick: () => handleViewMealsClick(category) }]);
//     }
//   }, [nodes]);

//   const addNodes = (parentNode: Node, newNodes: CustomNodeData[], offsetY: number = 0) => {
//     const x = (parentNode.position?.x || 0) + 200;
//     const y = (parentNode.position?.y || 0) - ((newNodes.length - 1) * 60) / 2 + offsetY;

//     const createdNodes = newNodes.map((node, index) => ({
//       id: `${parentNode.id}-${node.label}`,
//       type: 'custom',
//       data: node,
//       position: { x, y: y + index * 60 },
//     }));

//     const newEdges = createdNodes.map((node) => ({
//       id: `${parentNode.id}-${node.id}`,
//       source: parentNode.id,
//       target: node.id,
//     }));

//     setNodes((nds) => [...nds, ...createdNodes]);
//     setEdges((eds) => [...eds, ...newEdges]);
//   };

//   const onConnect = useCallback(
//     (params: any) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   return (
//     <div className="w-[80%]">
//       <div className="w-full flex flex-start pb-2">Food Explorer</div>

//       <div className="bg-zinc-200 p-4 h-[900px] w-full ">
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             // nodes={historyNodes ?? nodes}
//             // edges={historyEdges ?? edges}
//             // onNodesChange={handleNodesChange}
//             // onEdgesChange={handleEdgesChange}
//             // onConnect={handleConnect}
//             // @ts-ignore
//             nodeTypes={nodeTypes}
//           >
//             {/* <MiniMap /> */}
//             <Controls />
//             <Background />
//           </ReactFlow>
//       </div>
//     </div>
//   );
// };

// export default ReactFlowContainer;

"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  ConnectionLineType,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { XCircle } from "lucide-react";

// Updated mock data to match the image
const mockCategories = ["Pasta", "Chicken", "Dessert", "Seafood", "Vegan"];
const mockMeals = {
  Pasta: [
    "Spaghetti Carbonara",
    "Penne Arrabbiata",
    "Lasagna Bolognese",
    "Fettuccine Alfredo",
    "Ravioli with Spinach and Ricotta",
  ],
  Chicken: [
    "Grilled Lemon Chicken",
    "Butter Chicken",
    "Chicken Parmesan",
    "Chicken Tikka Masala",
    "Honey Garlic Chicken Stir Fry",
  ],
  Dessert: [
    "Chocolate Lava Cake",
    "Tiramisu",
    "Cheesecake",
    "Apple Pie",
    "Banoffee Pie",
  ],
  Seafood: [
    "Escovitch Fish",
    "Cajun Spiced Fish Tacos",
    "Baked Salmon with Fennel & Tomatoes",
    "Fish Fofos",
    "Grilled Portuguese Sardines",
    "Shrimp Scampi",
    "Lobster Bisque",
    "Crab Cakes",
  ],
  Vegan: [
    "Vegan Lentil Curry",
    "Grilled Tofu with Peanut Sauce",
    "Vegan Buddha Bowl",
    "Vegan Mushroom Stroganoff",
    "Quinoa Stuffed Bell Peppers",
  ],
};
const mockIngredients = ["Fennel", "Parsley", "Salmon", "Lemon", "Tomato"];
const mockTags = ["Healthy", "Quick", "Seafood", "Baked", "Mediterranean"];
const mockMealDetails =
  "Baked salmon with fennel & tomatoes is a delicious and healthy Mediterranean-inspired dish.";

interface CustomNodeData {
  label: string;
  type: "explore" | "category" | "option" | "meal" | "ingredient" | "tag";
  onClick?: () => void;
}

const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  const nodeStyle = {
    explore: "bg-gray-300 text-black",
    category: "bg-red-500 text-white",
    option: "bg-green-400 text-black",
    meal: "bg-blue-400 text-white",
    ingredient: "bg-purple-400 text-white",
    tag: "bg-purple-400 text-white",
  };

  return (
    <div>
      {/* <Handle
        type={data?.type == "explore" ? "source" : "target"}
        position={data?.type == "explore" ? Position.Right : Position.Left}
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      /> */}
      <Handle
        type={"target"}
        position={Position.Left}
        style={{ background: "transparent", border: "none" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      />
      <div
        className={`p-2 rounded-md ${nodeStyle[data.type]} cursor-pointer`}
        onClick={data.onClick}
      >
        {data.label}
      </div>

      <Handle
        type={"source"}
        position={Position.Right}
        style={{ background: "transparent", border: "none" }}
        // style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const FoodExplorerGraph1: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState("");

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNodes = (
    parentNode: Node,
    newNodes: CustomNodeData[],
    offsetY: number = 0
  ) => {
    const x = (parentNode.position?.x || 0) + 200;
    const y =
      (parentNode.position?.y || 0) -
      ((newNodes.length - 1) * 60) / 2 +
      offsetY;

    console.log(newNodes, "new nodes");
    console.log(parentNode, "parent new node");

    // const createdNodes = newNodes
    let currentNodes = [];
    setNodes((cur) => {
      currentNodes = [...cur];
      return currentNodes;
    });

    const createdNodes = newNodes
      .filter(
        (node) =>
          !currentNodes.some(
            (existingNode) =>
              existingNode.id === `${parentNode.id}-${node.label}`
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

    setNodes((nds) => [...nds, ...createdNodes]);
    setEdges((eds) => {
      let filteredEdges = newEdges.filter(
        (edge) => !eds.some((existingEdge) => existingEdge.id === edge.id)
      );

      return [...eds, ...filteredEdges];
    });
  };

  console.log("new nodes", nodes);
  console.log("new edges1", edges);

  const handleExploreClick = useCallback(() => {
    const categoryNodes = mockCategories.map((category) => ({
      label: category,
      type: "category" as const,
      onClick: () => handleCategoryClick(category),
    }));
    console.log("nodes", nodes);
    setNodes((currentNodes) => {
      const startNode = currentNodes[0];
      if (startNode) {
        addNodes(startNode, categoryNodes);
      }
      return currentNodes;
    });
  }, [nodes]);

  // const handleExploreClick = () => {
  //   const categoryNodes = mockCategories.map((category) => ({
  //     label: category,
  //     type: "category" as const,
  //     onClick: () => handleCategoryClick(category),
  //   }));
  //   // console.log("nodes2", nodes);
  // setNodes((currentNodes) => {
  //   const startNode = currentNodes[0];
  //   if (startNode) {
  //     addNodes(startNode, categoryNodes);
  //   }
  //   return currentNodes;
  // });
  //   // addNodes(nodes[0], categoryNodes);
  // };

  // console.log("nodes1", nodes);

  const handleCategoryClick = useCallback(
    (category: string) => {
      let newNodes = null;
      setNodes((currentNodes) => {
        newNodes = [...currentNodes];
        return currentNodes;
      });
      const parentNode = newNodes.find((node) => node.data.label === category);
      console.log("parent node", parentNode);
      if (parentNode) {
        addNodes(parentNode, [
          {
            label: "View Meals",
            type: "option",
            // category: category,
            onClick: () => {
              console.log("category", category);
              handleViewMealsClick(category);
            },
          },
        ]);
      }
    },
    [nodes]
  );

  const handleViewMealsClick = useCallback(
    (category: string) => {
      let currentNodes = null;
      setNodes((cur) => {
        currentNodes = [...cur];
        return currentNodes;
      });

      const parentNode = currentNodes.find(
        (node) =>
          node.data.label === "View Meals" 
        // && node.id.startsWith(`${category}-`)
      );
      // console.log(
      //   "category node",
      //   category,
      //   "parent ",
      //   parentNode,
      //   "new nodes",
      //   currentNodes
      // );
      if (parentNode) {
        console.log("parent node inside", parentNode);
        const mealNodes = mockMeals[category as keyof typeof mockMeals].map(
          (meal) => ({
            label: meal,
            type: "meal" as const,
            onClick: () => handleMealClick(meal, parentNode),
          })
        );
        addNodes(parentNode, mealNodes);
      }
    },
    [nodes]
  );

  const handleMealClick = useCallback((meal: string, parentNode: Node) => {
    const optionNodes = [
      {
        label: "View Ingredients",
        type: "option" as const,
        onClick: () => handleViewIngredientsClick(meal, parentNode),
      },
      {
        label: "View Tags",
        type: "option" as const,
        onClick: () => handleViewTagsClick(meal, parentNode),
      },
      {
        label: "View Details",
        type: "option" as const,
        onClick: () => handleViewDetailsClick(meal),
      },
    ];
    addNodes(parentNode, optionNodes, 100);
  }, []);

  const handleViewIngredientsClick = useCallback(
    (meal: string, parentNode: Node) => {
      const ingredientNodes = mockIngredients.map((ingredient) => ({
        label: ingredient,
        type: "ingredient" as const,
      }));
      const optionNode = nodes.find(
        (node) =>
          node.data.label === "View Ingredients" &&
          node.id.startsWith(`${parentNode.id}-`)
      );
      if (optionNode) {
        addNodes(optionNode, ingredientNodes);
      }
    },
    [nodes]
  );

  const handleViewTagsClick = useCallback(
    (meal: string, parentNode: Node) => {
      const tagNodes = mockTags.map((tag) => ({
        label: tag,
        type: "tag" as const,
      }));
      const optionNode = nodes.find(
        (node) =>
          node.data.label === "View Tags" &&
          node.id.startsWith(`${parentNode.id}-`)
      );
      if (optionNode) {
        addNodes(optionNode, tagNodes);
      }
    },
    [nodes]
  );

  const handleViewDetailsClick = useCallback((meal: string) => {
    setSelectedMeal(meal);
    setShowSidebar(true);
  }, []);

  const closeSidebar = () => {
    setShowSidebar(false);
    setSelectedMeal("");
  };

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
          // fitView
          // fitViewOptions={{
          // padding: 0.1,
          // includeHiddenNodes: false,
          // minZoom: 0.1,
          // maxZoom: 1,
          // duration: 200,
          // nodes: [{ id: "node-1" }, { id: "node-2" }], // nodes to fit
          // }}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {showSidebar && (
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
      )}
    </div>
  );

  return (
    <div className="w-full h-screen flex">
      hey
      <div className="flex-grow1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          // fitView
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background color="#f0f0f0" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {showSidebar && (
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
      )}
    </div>
  );
};

export default FoodExplorerGraph1;
