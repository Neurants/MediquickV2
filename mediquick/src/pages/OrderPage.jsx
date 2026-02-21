import React, { useEffect, useState, useContext } from "react";
import { ERPContext } from "../context/ERPContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function OrderPage() {
  const { orderType } = useContext(ERPContext);

  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [confirmedPharmacy, setConfirmedPharmacy] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [medicines] = useState([
    { id: 1, name: "Paracetamol", img: "/images/paracetamol.png", controlled: false },
    { id: 2, name: "Amoxicillin", img: "/images/amoxicillin.png", controlled: false },
    { id: 3, name: "Ibuprofen", img: "/images/ibuprofen.png", controlled: false },
    { id: 4, name: "Ephedrine", img: "/images/ephedrine.png", controlled: true },
  ]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        alert("Unable to get your location");
      }
    );
  }, []);

  // Fetch nearby pharmacies
  useEffect(() => {
    if (!userLocation) return;
    fetchNearbyPharmacies(userLocation[0], userLocation[1]);
  }, [userLocation]);

  const fetchNearbyPharmacies = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const query = `
        [out:json];
        node["amenity"="pharmacy"](around:1000,${lat},${lon});
        out;
      `;

      const response = await fetch("https://overpass.kumi.systems/api/interpreter", {
        method: "POST",
        body: query,
      });

      const text = await response.text();
      if (text.startsWith("<?xml")) throw new Error("Overpass API timeout");

      const data = JSON.parse(text);
      const results = data.elements.map((el) => ({
        id: el.id,
        name: el.tags?.name || "Unnamed Pharmacy",
        lat: el.lat,
        lon: el.lon,
      }));

      setPharmacies(results.slice(0, 10));
      setLoading(false);
    } catch (err) {
      console.error("Overpass error:", err);
      setError("Could not load pharmacies. Please try again.");
      setLoading(false);
    }
  };

  const handleConfirmPharmacy = () => {
    if (!selectedPharmacy) return;
    setConfirmedPharmacy(selectedPharmacy);
    setSelectedPharmacy(null);
  };

  const toggleMedicine = (med) => {
    const alreadySelected = selectedMedicines.find((m) => m.id === med.id);
    if (alreadySelected) {
      setSelectedMedicines(selectedMedicines.filter((m) => m.id !== med.id));
    } else {
      setSelectedMedicines([...selectedMedicines, med]);
    }
  };

  const requiresPrescription = selectedMedicines.some((m) => m.controlled);

  const handleUploadPrescription = (e) => {
    setPrescription(e.target.files[0]);
  };

  const handlePlaceOrder = () => {
    if (requiresPrescription && !prescription) {
      alert("Prescription required for controlled medicine!");
      return;
    }
    setOrderPlaced(true);
  };

  if (!userLocation) return <div className="text-center mt-10">Getting your location...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {orderType === "delivery" ? "Delivery Order" : "Pickup Order - Select Pharmacy"}
      </h1>

      {loading && <p>Loading pharmacies...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* MAP */}
      {!confirmedPharmacy && (
        <MapContainer center={userLocation} zoom={15} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
          {pharmacies.map((pharmacy) => (
            <Marker
              key={pharmacy.id}
              position={[pharmacy.lat, pharmacy.lon]}
              eventHandlers={{ click: () => setSelectedPharmacy(pharmacy) }}
            >
              <Popup>{pharmacy.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* SELECTED PHARMACY */}
      {selectedPharmacy && !confirmedPharmacy && (
        <div className="mt-4 p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Selected: {selectedPharmacy.name}</h2>
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleConfirmPharmacy}
          >
            Confirm Pharmacy
          </button>
        </div>
      )}

      {/* MEDICINES */}
      {confirmedPharmacy && !orderPlaced && (
        <div className="mt-6 p-6 bg-green-50 border rounded text-center">
          <h2 className="text-xl font-semibold mb-4">
            Ordering from: {confirmedPharmacy.name}
          </h2>

          <p className="mb-3">Select medicines:</p>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {medicines.map((med) => (
              <div
                key={med.id}
                className={`border rounded-lg p-2 cursor-pointer ${
                  selectedMedicines.includes(med) ? "border-green-600" : "border-gray-300"
                }`}
                onClick={() => toggleMedicine(med)}
              >
                <img src={med.img} alt={med.name} className="w-36 h-36 object-cover rounded" />
                <p className="mt-1 font-medium">{med.name}</p>
              </div>
            ))}
          </div>

          {/* Prescription upload */}
          {requiresPrescription && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Upload Prescription (required):</label>
              <input type="file" accept=".pdf,.jpg,.png" onChange={handleUploadPrescription} />
            </div>
          )}

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Place Order
          </button>
        </div>
      )}

      {/* ORDER PLACED + MOCK PAYMENT */}
      {orderPlaced && (
        <div className="mt-6 p-6 bg-blue-50 border rounded text-center">
          <h2 className="text-xl font-semibold mb-2">Order Sent to {confirmedPharmacy.name}</h2>

          <p className="mt-2 mb-4">Please wait for pharmacy confirmation.</p>

          <div>
            <p className="mb-2">Payment:</p>
            {!paymentDone ? (
              <button
                className="bg-yellow-500 px-6 py-2 rounded text-white"
                onClick={() => setPaymentDone(true)}
              >
                Pay Now
              </button>
            ) : (
              <p className="text-green-600 font-semibold">Payment completed!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}