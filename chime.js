// TASK 1: Create map centered on Bhutan
const map = L.map("map").setView([27.5, 90.4], 8);

// TASK 2: Add basemaps
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19
}).addTo(map);

const satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles © Esri",
    maxZoom: 19
  }
);

// TASK 3: Create layer groups
const dzongkhagLayer = L.layerGroup().addTo(map);
const gpslayer = L.layerGroup().addTo(map);


const gpsIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [40, 40]
});

// TASK 4: Zoom to Bhutan function
function zoomToBhutan() {
  map.setView([27.5, 90.4], 8);
}

// ==============================================
// REPLACE THESE WITH YOUR OWN IMAGE URLs
// ==============================================
const dzongkhagImages = {
  "Bumthang": "https://cdn.bookmytour.bt/uploads/attractions/jakar-dzong-fortress-of-the-white-bird-1526467605_850_400.jpg",
  "Chhukha": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSnL8WSwNh5oKfWF-4fgNjT9LvHb-5qa4vbQ&s",
  "Dagana": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2200HFLfH9YbgL6NMK0TJTWAxb6XXOkulWw&s",
  "Gasa": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1mvEpKBMtChcAdH3MYif79-mpZCxCgoHKsg&s",
  "Haa": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUb7TlRtiYDX2AltVo_5GHSPIKdH2GGlgpSQ&s",
  "Lhuentse": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6poIIftLGDZo7bVzvlyiL_pn_IvDaaZ_jow&s",
  "Mongar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTccPk8YcnG9ZJibLDQWOSE0nxi64pJvdDCtA&s",
  "Paro": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLWb5_6aUziUD0xfNDVurKmNh1cz1UmUY4mg&s",
  "Pemagatshel": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL7HU15uoAGDad7P60y5d6ogxZRF1oaOI0Gg&s",
  "Punakha": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg5O5jaBWnDLVFIQlCo7rffUuT4dH2oFpoqg&s",
  "Samdrup Jongkhar": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD-CXHkU9L69UnNf5AGikZMB_7y9ft0d4R2Q&s",
  "Samtse": "https://www.prayerflagstours.com/wp-content/uploads/2023/10/54361657_1085183935006779_7071736796157050880_n-800x800.jpg",
  "Sarpang": "https://www.sarpang.gov.bt/wp-content/uploads/2025/06/Sarpang-Dzong.jpg",
  "Thimphu": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMZT57Uln2_DaEzYTVRA-NSdpDpOWVjksF0w&s",
  "Tashigang": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDrRtUb6aUhF_QYtOBcWa8jzcefv_8ZsZ92w&s",
  "Tashi Yangtse": "https://trashiyangtse.gov.bt/wp-content/uploads/2025/05/Trashiyangtse-Dzong_0-768x432.jp",
  "Trongsa": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhzmufdiPkWrPaPglPkbzs54ZUeIb7DE7SNw&s",
  "Tsirang": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpjxbc2OnIR04kHv7YBTn_RzbJL5D1R92kLw&s",
  "Wangdue Phodrang": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPunxljY9r-wJdFmKCqE2M5CDv8y71-p1Sbg&s",
  "Zhemgang": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNTZPIk6QTZwMeYSQM2GsPcI263cR_yg_Vgg&s"
};

// Fallback image if specific image not found
const fallbackImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Bhutan_Taktshang%2C_Paro%2C_Bhutan_%282%29.jpg/500px-Bhutan_Taktshang%2C_Paro%2C_Bhutan_%282%29.jpg";

// Variable to store the GeoJSON layer for bounds calculation
let geoJsonLayer = null;

// Function to get dzongkhag name
function getDzongkhagName(feature) {
  return feature.properties?.dzongkhag || "Unknown Dzongkhag";
}

// Function to create popup with image
function createImagePopup(feature, layer) {
  const dzongkhagName = getDzongkhagName(feature);
  const dzongkhagCode = feature.properties?.dzo_code || "N/A";
  const imageUrl = dzongkhagImages[dzongkhagName] || fallbackImage;
  
  // Beautiful popup HTML
  const popupHtml = `
    <div style="min-width: 300px; max-width: 350px; font-family: 'Segoe UI', Arial, sans-serif;">
      <div style="border-bottom: 3px solid #ff9800; margin-bottom: 12px;">
        <h4 style="color: #ff9800; margin: 0 0 8px 0; font-size: 20px;">
           ${dzongkhagName} Dzongkhag
        </h4>
      </div>
      <div style="text-align: center; margin-bottom: 12px;">
        <img 
          src="${imageUrl}" 
          alt="${dzongkhagName}" 
          style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 3px 6px rgba(0,0,0,0.2);"
          onerror="this.src='${fallbackImage}'; this.onerror=null;"
        >
    
    </div>
  `;
  
  layer.bindPopup(popupHtml, {
    className: 'custom-popup',
    maxWidth: 350,
    minWidth: 300
  });
  
  // Open popup on hover
  let timeoutId;
  layer.on('mouseover', function() {
    layer.openPopup();
    if (timeoutId) clearTimeout(timeoutId);
  });
  
  // Close popup after 3 seconds on mouseout
  layer.on('mouseout', function() {
    timeoutId = setTimeout(() => {
      if (layer.isPopupOpen()) {
        layer.closePopup();
      }
    }, 3000);
  });
}

// TASK 5: Load GeoJSON data
fetch("../dzongkhags.geojson")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(" GeoJSON loaded successfully!");
    console.log(`Total dzongkhags: ${data.features.length}`);
  fetch("../gps_first_order.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {

      // THIS is the key fix
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: gpsIcon });
      },

      onEachFeature: function(feature, layer) {
        layer.bindPopup("GPS station");
      }

    }).addTo(gpslayer);
  });
    
    // Create GeoJSON layer
    geoJsonLayer = L.geoJSON(data, {
      style: {
        color: "#ff9800",
        weight: 2,
        fillColor: "#ff9800",
        fillOpacity: 0.2,
        opacity: 0.8
      },
      onEachFeature: function(feature, layer) {
        createImagePopup(feature, layer);
        console.log(` Added: ${feature.properties.dzongkhag} (Code: ${feature.properties.dzo_code})`);
      }
    }).addTo(dzongkhagLayer);
    
    // Fit map to show all dzongkhags - FIXED
    if (geoJsonLayer.getBounds) {
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    }
  })
  .catch(error => {
    console.error("❌ Error loading GeoJSON:", error);
    L.popup()
      .setLatLng([27.5, 90.4])
      .setContent(" Error loading dzongkhag boundaries. Please check if the file path is correct.")
      .openOn(map);
  });

// TASK 6: Add layer controls
const overlayMaps = {
  " Dzongkhag Boundaries": dzongkhagLayer,
  "GPS station": gpslayer,
};

const baseMaps = {
  "🗺️ OpenStreetMap": osm,
  "🛰️ Satellite Imagery": satellite
};

L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);

// Add scale bar
L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);


console.log(" Map application ready! Hover over any dzongkhag to see its image and information.");