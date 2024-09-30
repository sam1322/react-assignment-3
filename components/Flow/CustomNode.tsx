"use client";
import { CustomNodeData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import {
  ArrowBigRightDashIcon,
  CircleStopIcon,
  FeatherIcon,
  GlobeIcon,
  Music2Icon,
} from "lucide-react";
import { FC, useState } from "react";

interface CustomNodeProps {
  data: CustomNodeData;
}

const CustomNode: FC<CustomNodeProps> = ({ data }) => {
  // const { label, type, id, parentId, onClick } = data;
  const { type, onClick } = data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setState] = useState(0);
  const nodeStyle = {
    explore: "bg-white text-black p-4",
    category: "bg-white text-black p-4",
    option: "bg-white text-black rounded-full p-0 text-sm",
    meal: "bg-white text-black p-4",
    ingredient: "bg-white text-black p-4",
    tag: "bg-white text-black p-4",
  };

  const iconStyle = {
    explore: "bg-gray-300 text-white ",
    category: "bg-red-500 text-white",
    option: "bg-white text-green-400 ml-2 -mr-2",
    meal: "bg-blue-400 text-white ",
    ingredient: "bg-purple-400 text-white",
    tag: "bg-purple-400 text-white",
  };

  let Icon = GlobeIcon;
  let size = 24;
  switch (type) {
    case "explore":
      Icon = GlobeIcon;
      break;
    case "category":
      Icon = FeatherIcon;
      size = 18;
      break;
    case "option":
      Icon = ArrowBigRightDashIcon;
      break;
    case "meal":
      Icon = CircleStopIcon;
      break;
    case "ingredient":
      Icon = Music2Icon;
      break;
    case "tag":
      Icon = Music2Icon;
      break;
  }

  const handleOnClick = () => {
    setState((prev) => {
      if (
        (data.type != "explore" || prev === 0) &&
        typeof onClick === "function"
      ) {
        onClick();
        return 1;
      } else {
        console.log("already added");
      }
      return prev;
    });
  };

  return (
    <div>
      <Handle
        type={"target"}
        position={Position.Left}
        style={{ background: "transparent", border: "none" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      />
      <div
        className={cn(
          `p-2 rounded-md ${
            nodeStyle[data.type]
          } cursor-pointer gap-2 flex items-center `
        )}
        onClick={handleOnClick}
        title={data.label}
      >
        <div
          className={`p-1 rounded-md ${iconStyle[data.type]} cursor-pointer`}
        >
          <Icon size={size} />
        </div>
        <div className="max-w-[150px] w-[150px] truncate">{data.label}</div>
      </div>

      <Handle
        type={"source"}
        position={Position.Right}
        style={{ background: "transparent", border: "none" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      />
    </div>
  );
};

export default CustomNode;
