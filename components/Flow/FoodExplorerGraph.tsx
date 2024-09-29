import { FC } from "react";
import CustomNode from "./CustomNode";
import { NodeTypes } from "@xyflow/react";

interface FoodExplorerGraphProps {}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const FoodExplorerGraph: FC<FoodExplorerGraphProps> = ({}) => {
  return <div>FoodExplorerGraph</div>;
};

export default FoodExplorerGraph;
