
export type BuildingFeature = {
  id: string;
  properties: {
    name?: string;
    address?: string;
    height?: number;
    [key: string]: any; 
  };
  geometry: {
    type: string;
    coordinates: any;
  };
};

export type BuildingInfoCardProps = {
  building: BuildingFeature;
  onIncreaseHeight: () => void;
  onClose: () => void; 
};
