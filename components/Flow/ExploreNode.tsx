import React, { memo } from "react";

interface CustomSelectorNodeProps {
  data: any;
  id: string;
  selected: boolean;
}

const CustomSelectorNode = ({
  data,
  id,
  selected,
  ...resProps
}: CustomSelectorNodeProps) => {
  let label = "Explore";

  return (
    <div className="bg-white w-full h-full border-4 border-blue-400 p-4 py-2 rounded-3xl flex gap-6 items-center">
      {/* <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        // isConnectable={isConnectable}
      /> */}
      <div className="flex gap-2 items-center justify-center w-full truncate">
        {label}
      </div>
      {/* <div className="text-xl text-red-500">&#10005; </div> */}
    </div>
  );
};

// export default CustomSelectorNode;
export default memo(CustomSelectorNode);
