"use client";
import { mockCategories } from "@/lib/constants";
import {
  CategoryData,
  CustomNodeData,
  MealByCategoryData,
  MealData,
} from "@/lib/types";

import {
  addEdge,
  Background,
  Connection,
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
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import CustomNode from "./CustomNode";
import MealDetailsSidebar from "./MealDetailsSidebar";

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

const FoodExplorerGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [mealDetails, setMealDetails] = useState<MealData | null>(null);

  const onCloseSideBar = () => {
    setOpenSidebar(false);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  function extractNumber(str: string) {
    const match = str.match(/^(\d+)_/);
    return match ? parseInt(match[1]) : 0;
  }

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

    const currentLevel = extractNumber(parentNode.id);

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
              existingNode.id ===
              `${currentLevel}_${parentNode.data.label}-${node.label}`
            // existingNode.id === `${parentNode.id}-${node.label}`
            // existingNode.id === `${node.label}`
          )
      )
      .map((node, index) => ({
        id: `${currentLevel + 1}_${parentNode.data.label}-${node.label}`,
        // id: `${parentNode.id}-${node.label}`,
        // id: `${node.label}`,
        type: "custom",
        data: {
          ...node,
          parentId: parentNode.id,
          nodeId: `${currentLevel + 1}_${parentNode.data.label}-${node.label}`,
        },
        position: { x, y: y + index * 90 },
      }));

    const newEdges = createdNodes.map((node) => ({
      id: `${parentNode.id}-${node.id}`,
      source: parentNode.id,
      target: node.id,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));

    // console.log("new edges2", newEdges, Date.now().toLocaleString());

    //before adding we will check if there are any existing nodes in the same level if yes we will remove them
    // const filteredNodes = currentNodes.filter(
    //   (node) => extractNumber(node.id) > currentLevel
    // );

    setNodes((nds) => {
      // console.log("previous nodes", nds);
      const filteredNodes = nds.filter(
        (node) => extractNumber(node.id) <= currentLevel
      );
      // console.log("filtered nodes", filteredNodes, currentLevel);

      return [
        // ...nds
        ...filteredNodes,
        ...createdNodes,
      ];
    });
    setEdges((eds) => {
      const filteredEdges = newEdges.filter(
        (edge) => !eds.some((existingEdge) => existingEdge.id === edge.id)
      );
      // TODO: implement a clean up function for the previous existing nodes on the current level before adding new edges

      return [...eds, ...filteredEdges];
    });
  };

  // console.log("nodes", nodes);
  // console.log("edges", edges);

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

      //checking if the node already exists
      // const viewMealNode = currentNodes.find(
      //   (node) => node.data.label === "View Meals"
      // );

      // if (viewMealNode) {
      //   console.log("viewMealNode already added", viewMealNode);
      //   return;
      // }

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
          onClick: (nodeId: string) => {
            console.log("meal", meal, nodeId);
            handleMealClick(meal, nodeId);
          },
          id: meal.id,
          parentId: "View Meals",
        }));
        addNodes(parentNode, mealNodes);
      }
    },
    [nodes]
  );

  const handleViewMealsByIngredientClick = useCallback(
    async (ingredient: string) => {
      let currentNodes = [] as Node[];
      setNodes((cur) => {
        currentNodes = [...cur];
        return currentNodes;
      });

      const parentNode = currentNodes.find(
        (node) => node.data.label === ingredient
        // (node) => node.data.label === "View Meals"
        // && node.id.startsWith(`${category}-`)
      );

      if (parentNode) {
        const mealsList = (await getMealsByIngredient(ingredient)) as {
          name: string;
          id: string;
        }[];
        const mealNodes = mealsList.map((meal) => ({
          label: meal.name,
          type: "meal" as const,
          onClick: (nodeId: string) => {
            console.log("meal", meal);
            handleMealClick(meal, nodeId);
          },
          id: meal.id,
          parentId: "View Meals",
        }));
        addNodes(parentNode, mealNodes);
      }
    },
    [nodes]
  );

  const handleMealClick = useCallback(
    (meal: { name: string; id: string }, parentId: string) => {
      const optionNodes = [
        {
          label: "View Ingredients",
          type: "option" as const,
          parentId: meal.name,
          id: "View Ingredients",
          onClick: (id: string) => handleViewIngredientsClick(meal, id),
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
        (node) => node.id === parentId
        // (node) => node.data.label === meal.name
      );

      if (parentNode) {
        addNodes(parentNode, optionNodes, 130);
      }
    },
    []
  );

  const handleViewIngredientsClick = useCallback(
    async (meal: { name: string; id: string }, parentId: string) => {
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
        onClick: () => handleViewMealsByIngredientClick(ingredient),
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
        (node) => node.id === parentId
        // node.id.startsWith(`${parentNode.id}-`)
      );

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
      const categories = data.categories as CategoryData[];
      return categories
        .slice(0, 5)
        .map((category: CategoryData) => category.strCategory);
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
      const meals = data.meals as MealByCategoryData[];
      return meals.slice(0, 5).map((meal: MealByCategoryData) => ({
        name: meal.strMeal,
        id: meal.idMeal,
      }));
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  const getMealsByIngredient = async (ingredient: string) => {
    try {
      const result = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      const data = result.data;
      const meals = data.meals as MealByCategoryData[];
      return meals.slice(0, 5).map((meal: MealByCategoryData) => ({
        name: meal.strMeal,
        id: meal.idMeal,
      }));
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
      const meal = data.meals[0] as MealData;
      return meal;
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  useEffect(() => {
    setNodes([
      {
        id: "0_start",
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
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {/* hey
      <Button onClick={() => setOpenSidebar(!openSidebar)}>Open SideBar</Button> */}
      <MealDetailsSidebar
        // data={mockMealDetails}
        data={mealDetails}
        open={openSidebar}
        onClose={onCloseSideBar}
      />
    </div>
  );
};

export default FoodExplorerGraph;
