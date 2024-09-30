export interface CustomNodeData {
  label: string;
  type: "explore" | "category" | "option" | "meal" | "ingredient" | "tag";
  id: string;
  parentId: string;
  onClick?: () => void;
}
