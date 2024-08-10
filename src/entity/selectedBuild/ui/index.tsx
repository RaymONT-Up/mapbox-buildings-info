import { FC } from "react";

import { BuildingInfoCardProps } from "../types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui";

export const BuildingInfoCard: FC<BuildingInfoCardProps> = ({
  building,
  onIncreaseHeight,
  onClose,
}) => {
  return (
    <Card className="absolute left-0 bottom-0 m-4 shadow-lg bg-white w-80">
      <div className="flex justify-between items-center p-4">
        <CardHeader>
          <CardTitle>{building.properties.name || "Building"}</CardTitle>
          <CardDescription>
            {building.properties.address || "No address available"}
          </CardDescription>
        </CardHeader>
        <Button variant="outline" className="p-2 size-12" onClick={onClose}>
          X
        </Button>
      </div>
      <CardContent>
        <p>Height: {building.properties.height || "Unknown"} meters</p>
        {/* Отображаем дополнительные свойства, если они есть */}
        {Object.keys(building.properties).map(
          (key) =>
            key !== "name" &&
            key !== "address" &&
            key !== "height" && (
              <p key={key}>
                {key}: {building.properties[key]}
              </p>
            )
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onIncreaseHeight}>Увеличить высоту</Button>
      </CardFooter>
    </Card>
  );
};
