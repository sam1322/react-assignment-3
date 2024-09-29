import { Handle, Position } from "@xyflow/react";
import { FC } from "react";

interface CustomNodeProps {
  data: {
    label: string;
    type: "explore" | "category" | "option" | "meal" | "ingredient" | "tag";
    id: string;
    parentId: string;
    onClick?: () => void;
  };
}

const CustomNode: FC<CustomNodeProps> = ({ data }) => {
  const { label, type, id, parentId, onClick } = data;
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

export default CustomNode;
