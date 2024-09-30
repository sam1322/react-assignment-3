"use client";
import { FC, useCallback, useEffect, useState } from "react";
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
import { mockCategories, mockMealDetails, mockMeals } from "@/lib/constants";
import { CustomNodeData } from "@/lib/types";
import axios from "axios";
import MealDetailsSidebar from "./MealDetailsSidebar";
import { Button } from "../ui/button";

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
  const [openSidebar, setOpenSidebar] = useState(false);
  const [mealDetails, setMealDetails] = useState<any>(null);

  const onCloseSideBar = () => {
    setOpenSidebar(false);
  };

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
    // console.log("x position", parentNode.position?.x);
    // console.log("y position", parentNode.position?.y);
    // console.log("width", parentNode?.measured?.width);

    const x =
      (parentNode.position?.x || 0) +
      (parentNode?.measured?.width || 0) +
      offsetX;
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
              existingNode.id === `${parentNode.id}-${node.label}`
            // existingNode.id === `${node.label}`
          )
      )
      .map((node, index) => ({
        id: `${parentNode.id}-${node.label}`,
        // id: `${node.label}`,
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

  const handleExploreClick = useCallback(async () => {
    // const categoryNodes = mockCategories.map((category) => ({
    //   label: category,
    //   type: "category" as const,
    //   onClick: () => handleCategoryClick(category),
    //   id: category,
    //   parentId: "start",
    // }));

    const categoryList = (await getCatoryList()) as string[];

    const categoryNodes = categoryList.map((category) => ({
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

      const viewMealNode = currentNodes.find(
        (node) => node.data.label === "View Meals"
      );

      if (viewMealNode) {
        console.log("viewMealNode already added", viewMealNode);
        return;
      }

      const parentNode = currentNodes.find(
        (node) => node.data.label === category
      );

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
              handleViewMealsClick(category);
            },
          },
        ] as CustomNodeData[];
        addNodes(parentNode, childrenNodes, 100);
      }
    },
    [nodes]
  );

  const handleViewMealsClick = useCallback(
    async (category: string) => {
      let currentNodes = [] as Node[];
      setNodes((cur) => {
        currentNodes = [...cur];
        return currentNodes;
      });

      const parentNode = currentNodes.find(
        (node) => node.data.label === "View Meals"
        // && node.id.startsWith(`${category}-`)
      );

      if (parentNode) {
        console.log("parent node inside", parentNode);

        const mealsList = (await getMealsByCategory(category)) as {
          name: string;
          id: string;
        }[];
        const mealNodes = mealsList.map((meal) => ({
          label: meal.name,
          type: "meal" as const,
          onClick: () => {
            console.log("meal", meal);
            handleMealClick(meal, parentNode);
          },
          id: meal.id,
          parentId: "View Meals",
        }));
        // const mealNodes = mockMeals[category as keyof typeof mockMeals].map(
        //   (meal) => ({
        //     label: meal,
        //     type: "meal" as const,
        //     // onClick: () => handleMealClick(meal, parentNode),
        //   })
        // );
        addNodes(parentNode, mealNodes);
      }
    },
    [nodes]
  );

  const handleMealClick = useCallback(
    (meal: { name: string; id: string }, parentNode1: Node) => {
      const optionNodes = [
        {
          label: "View Ingredients",
          type: "option" as const,
          parentId: meal.name,
          id: "View Ingredients",
          onClick: () => handleViewIngredientsClick(meal),
        },
        {
          label: "View Tags",
          type: "option" as const,
          parentId: meal.name,
          id: "View Tags",
          onClick: () => handleViewTagsClick(meal),
        },
        {
          label: "View Details",
          type: "option" as const,
          parentId: meal.name,
          id: "View Details",
          onClick: () => handleViewDetailsClick(meal),
        },
      ];

      let currentNodes = [] as Node[];
      setNodes((cur) => {
        currentNodes = [...cur];
        return currentNodes;
      });

      const parentNode = currentNodes.find(
        (node) => node.data.label === meal.name
      );

      console.log("parent node", parentNode, currentNodes, meal);

      if (parentNode) {
        console.log("parent node inside", parentNode, optionNodes);
        addNodes(parentNode, optionNodes, 130);
      }
    },
    []
  );

  const handleViewIngredientsClick = useCallback(
    async (meal: { name: string; id: string }) => {
      const mealDetails = await getMealDetails(meal.id);
      if (!mealDetails) {
        console.error("No meal details found");
        return;
      }

      const ingredientList = [];
      console.log("mealDetails", mealDetails);
      for (let i = 1; i <= 20; i++) {
        const ingredient = mealDetails[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
          ingredientList.push(ingredient);
        }
      }

      const ingredientNodes = ingredientList.map((ingredient) => ({
        label: ingredient,
        type: "ingredient" as const,
        id: ingredient,
        parentId: meal.name,
      }));
      console.log("ingredientList", ingredientList);
      console.log("ingredientNodes", ingredientNodes);

      // This weird hack is done because the currentNodes state is not being updated inside these functions as they are using the previous lexical state
      let currentNodes = [] as Node[];
      setNodes((cur) => {
        currentNodes = [...cur];
        return currentNodes;
      });

      const optionNode = currentNodes.find(
        (node) => node.data.label === "View Ingredients"
        // node.id.startsWith(`${parentNode.id}-`)
      );

      console.log("optionNode", optionNode);
      if (optionNode) {
        addNodes(optionNode, ingredientNodes);
      }
    },
    [nodes]
  );

  const handleViewTagsClick = useCallback(
    async (meal: { name: string; id: string }) => {
      const mealDetails = await getMealDetails(meal.id);
      if (!mealDetails) {
        console.error("No meal details found");
        return;
      }

      let tagsList = [] as string[];

      if (mealDetails?.strTags) {
        tagsList = mealDetails?.strTags.split(",");
      }

      const ingredientNodes = tagsList.map((ingredient) => ({
        label: ingredient,
        type: "tag" as const,
        id: ingredient,
        parentId: meal.name,
      }));

      // This weird hack is done because the currentNodes state is not being updated inside these functions as they are using the previous lexical state
      let currentNodes = [] as Node[];
      setNodes((cur) => {
        currentNodes = [...cur];
        return currentNodes;
      });

      const optionNode = currentNodes.find(
        (node) => node.data.label === "View Tags"
        // node.id.startsWith(`${parentNode.id}-`)
      );

      if (optionNode) {
        addNodes(optionNode, ingredientNodes);
      }
    },
    [nodes]
  );

  const handleViewDetailsClick = useCallback(
    async (meal: { name: string; id: string }) => {
      const mealDetails = await getMealDetails(meal.id);
      if (!mealDetails) {
        console.error("No meal details found");
        return;
      }
      setMealDetails(mealDetails);
      setOpenSidebar(true);
    },
    [nodes]
  );

  const getCatoryList = async () => {
    try {
      const result = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = result.data;
      const categories = data.categories as any[];
      return categories
        .slice(0, 5)
        .map((category: any) => category.strCategory);
    } catch (err) {
      console.error(err);
    }
    return mockCategories;
  };

  const getMealsByCategory = async (category: string) => {
    try {
      const result = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const data = result.data;
      const meals = data.meals as any[];
      return meals
        .slice(0, 5)
        .map((meal: any) => ({ name: meal.strMeal, id: meal.idMeal }));
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  const getMealDetails = async (mealId: string) => {
    try {
      const result = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const data = result.data;
      const meal = data.meals[0] as any;
      return meal;
    } catch (err) {
      console.error(err);
    }
    return null;
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
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      hey
      <Button onClick={() => setOpenSidebar(!openSidebar)}>Open SideBar</Button>
      <MealDetailsSidebar
        // data={mockMealDetails}
        data={mealDetails}
        open={openSidebar}
        onClose={onCloseSideBar}
      />
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
