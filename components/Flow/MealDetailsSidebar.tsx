import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MealData } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface MealDetailsSidebarProps {
  data: MealData | null;
  open: boolean;
  onClose: () => void;
}

const MealDetailsSidebar: FC<MealDetailsSidebarProps> = ({
  data,
  open,
  onClose,
}) => {
  if (!data) return null;

  const strMeal = data?.strMeal;
  const strYoutube = data?.strYoutube;
  const strArea = data?.strArea;
  const strCategory = data?.strCategory;
  const strMealThumb = data?.strMealThumb;
  const strSource = data?.strSource;

  const ingredientList = [];
  // console.log("mealDetails", mealDetails);
  for (let i = 1; i <= 20; i++) {
    const ingredient = data[`strIngredient${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredientList.push(ingredient);
    }
  }
  const tags = data?.strTags?.split(",");
  const colors = ["red", "purple", "orange", "green", "blue", "yellow"];
  const tagColor = [
    { name: "Paleo", backgroundColor: "#e9d5ff", borderColor: "#c084fc" },
    { name: "Keto", backgroundColor: "#fef9c3", borderColor: "#facc15" },
    { name: "HighFat", backgroundColor: "#fed7aa", borderColor: "#fb923c" },
    { name: "Baking", backgroundColor: "#fed7aa", borderColor: "#fb923c" },
    { name: "LowCarbs", backgroundColor: "#fed7aa", borderColor: "#fb923c" },
  ];
  return (
    <div className="w-full">
      <Sheet open={open} onOpenChange={onClose}>
        {/* <SheetTrigger>Open</SheetTrigger> */}
        <SheetContent className="w-[500px] sm:w-[640px] pr-0">
          <div className=" max-h-[97%] pr-4 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{strMeal}</SheetTitle>
              <hr className="my-3" />
              <Image
                src={strMealThumb}
                width={600}
                height={100}
                alt={strMeal}
              />
              {/* <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription> */}
            </SheetHeader>
            <div className="flex items-center gap-2 mt-2">
              {tags?.length > 0 &&
                tags.map((item: string, index: number) => (
                  <div
                    key={item}
                    className={cn(
                      `border rounded-full p-1 px-2 text-sm`

                      // `border-orange-400 bg-orange-200`
                    )}
                    style={{
                      backgroundColor:
                        tagColor[index % colors.length].backgroundColor,
                      borderColor: tagColor[index % colors.length].borderColor,
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="font-semibold text-zinc-500">Category</div>
              <div className="opacity-80">{strCategory}</div>
              <div className="font-semibold text-zinc-500">Area</div>
              <div>{strArea}</div>
              {strYoutube && strYoutube?.trim() != "" && (
                <>
                  <div className="font-semibold text-zinc-500">Youtube</div>
                  <Link
                    href={strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline  break-words"
                  >
                    {strYoutube}
                  </Link>
                </>
              )}
              {strSource && strSource?.trim() != "" && (
                <>
                  <div className="font-semibold text-zinc-500">Recipe</div>
                  <Link
                    href={strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline break-words"
                  >
                    <p>{strSource}</p>
                  </Link>
                </>
              )}
            </div>
            <div className="border border-black p-4 mt-3">
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <p className="text-gray-700">
                {/* {data?.strInstructions} */}
                {data?.strInstructions?.replace(/\n/g, " ")}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MealDetailsSidebar;
