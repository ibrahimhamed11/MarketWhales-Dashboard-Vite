import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { MaterialReactTable } from "material-react-table";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register country locales
countries.registerLocale(enLocale);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ userData = [] }) => {
  const [tooltipContent, setTooltipContent] = useState(null);

  // Group user count by country
  const countryUserData = userData.reduce((acc, user) => {
    const country = user.location?.country?.trim() || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const colorScale = scaleLinear()
    .domain([0, Math.max(...Object.values(countryUserData)) || 1])
    .range(["#000000FF", "#22F4FFFF"]);

  const getCountryName = (code) => {
    if (!code || code === "Unknown") return "Unknown";
    return countries.getName(code, "en") || code;
  };

  const tableData = Object.entries(countryUserData).map(([countryCode, count]) => ({
    country: getCountryName(countryCode),
    count,
    code: countryCode.toLowerCase(),
  }));

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "start", gap: "20px", padding: "20px", position: "relative" }}>
      
      {/* World Map Section */}
      <div style={{ flex: 1, minWidth: "50%", position: "relative" }}>
        <ComposableMap projectionConfig={{ scale: 150 }}>
          <Geographies geography={geoUrl} >
            {({ geographies }) =>
              geographies.map((geo) => {
                const country = geo.properties?.NAME?.trim() || "Unknown";
                const userCount = countryUserData[country] || 0;
                return (
                    <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={colorScale(userCount)}
                    stroke="#333"
                    strokeWidth={0.8}
                    style={{
                      default: { outline: "black" },
                      hover: {},
                      pressed: {},
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Plot User Locations */}
          {userData.map((user, index) => {
            if (!user.location?.ll || user.location.ll.length !== 2) return null;
            const countryName = getCountryName(user.location.country);
            return (
              <Marker
                key={index}
                coordinates={user.location.ll}
                onMouseEnter={() => setTooltipContent({ country: countryName, users: countryUserData[user.location.country] || 0 })}
                onMouseLeave={() => setTooltipContent(null)}
              >
                <circle r={5} fill="red" stroke="blue" strokeWidth={1} />
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Tooltip */}
        {/* {tooltipContent && (
          <div style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px",
            borderRadius: "5px",
          }}>
            <strong>{tooltipContent.country}</strong><br />
            Total Users: {tooltipContent.users}
          </div>
        )} */}
      </div>

      {/* Table Section */}
      <MaterialReactTable
        columns={[
          { accessorKey: "country", header: "Country" },
          { accessorKey: "count", header: "Total Users" },
        ]}
        data={tableData}
        initialState={{ pagination: { pageSize: 10 } }}
        enablePagination
        enableSorting
      />
    </div>
  );
};

export default WorldMap;
