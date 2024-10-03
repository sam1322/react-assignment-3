export interface CustomNodeData {
  label: string;
  type: "explore" | "category" | "option" | "meal" | "ingredient" | "tag";
  id: string;
  parentId: string;
  nodeId?: string;
  onClick?: (id?: string, parentId?: string) => void;
}

export interface MealData {
  strMeal: string;
  strYoutube: string;
  strArea: string;
  strCategory: string;
  strMealThumb: string;
  strSource: string;
  strTags: string;
  strInstructions: string;
  [key: string]: string | undefined; // For dynamic properties like strIngredient1, strIngredient2, etc.
}

export interface MealByCategoryData {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

export interface CategoryData {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}
