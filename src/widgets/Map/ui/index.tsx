"use client";
import React, { useState, useCallback, useRef } from "react";
import Map, { Layer, Source, MapRef } from "react-map-gl";
import { MapLayerMouseEvent } from "mapbox-gl";
import { BuildingFeature, BuildingInfoCard } from "@/entity/selectedBuild";

export const MapComponent = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingFeature | null>(null);
  const [highlightedBuilding, setHighlightedBuilding] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);

  const handleClick = useCallback((event: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Получение всех фичей в точке клика
    const features = map.queryRenderedFeatures(event.point, {
      layers: ['3d-buildings']
    });

    if (features.length > 0) {
      // Предположим, что все фичи представляют одно здание
      const buildingFeature = features[0];
      setSelectedBuilding(buildingFeature as BuildingFeature);
      setHighlightedBuilding(buildingFeature.id as string);
    } else {
      setSelectedBuilding(null);
      setHighlightedBuilding(null);
    }
  }, []);

  const handleExtrusionIncrease = () => {
    if (!selectedBuilding) return;

    // Увеличение высоты здания
    const newHeight = (selectedBuilding.properties.height || 0) + 10; // Увеличиваем на 10 метров

    setSelectedBuilding({
      ...selectedBuilding,
      properties: {
        ...selectedBuilding.properties,
        height: newHeight,
      }
    });

    // Обновляем высоту в Mapbox
    const map = mapRef.current?.getMap();
    if (map) {
      map.setPaintProperty('3d-buildings', 'fill-extrusion-height', ['case',
        ['==', ['id'], highlightedBuilding],
        newHeight,
        ['get', 'height']
      ]);
    }
  };

  return (
    <div className="relative h-screen">
      <Map
        initialViewState={{
          latitude: 37.7749,
          longitude: -122.4194,
          zoom: 16,
        }}
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        interactiveLayerIds={["3d-buildings"]}
        onClick={handleClick}
        ref={mapRef}
      >
        <Source
          id="composite"
          type="vector"
          url="mapbox://mapbox.mapbox-streets-v8"
        >
          <Layer
            id="3d-buildings"
            type="fill-extrusion"
            source="composite"
            source-layer="building"
            paint={{
              'fill-extrusion-color': ['case',
                ['==', ['id'], highlightedBuilding],
                '#ff0000', // Цвет для выделенного здания
                '#aaa' // Цвет для остальных
              ],
              'fill-extrusion-height': ['case',
                ['==', ['id'], highlightedBuilding],
                ['get', 'height'],
                ['get', 'height']
              ],
              'fill-extrusion-opacity': 0.8
            }}
          />
        </Source>
      </Map>
      {selectedBuilding && (
        <BuildingInfoCard
          onClose={() => setSelectedBuilding(null)}
          building={selectedBuilding}
          onIncreaseHeight={handleExtrusionIncrease}
        />
      )}
    </div>
  );
};
