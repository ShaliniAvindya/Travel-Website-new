import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AllTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTour, setEditTour] = useState(null);
  const [editData, setEditData] = useState({});
  const [imageFiles, setImageFiles] = useState({
    activityImages: [],
    destinationImages: [],
    hotelImages: [],
    tourImage: null,
    itineraryImages: {},
  });
  const [itineraryData, setItineraryData] = useState([]);
  const [nightCount, setNightCount] = useState(5); // Default nights

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tours");
        setTours(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch tours. Please try again later.");
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleEditOpen = (tour) => {
    setEditTour(tour);
    setEditData(tour); // Prepopulate form with selected tour data
    setNightCount(tour.nights || 5);
  };

  const handleEditClose = () => {
    setEditTour(null);
    setEditData({});
    setImageFiles({
      activityImages: [],
      destinationImages: [],
      hotelImages: [],
      tourImage: null,
      itineraryImages: {},
    });
    setItineraryData([]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItineraryChange = (dayIndex, e) => {
    const { name, value } = e.target;
    const updatedItinerary = [...itineraryData];
    updatedItinerary[dayIndex] = { ...updatedItinerary[dayIndex], [name]: value };
    setItineraryData(updatedItinerary);
  };

  const handleItineraryAdd = () => {
    setItineraryData([...itineraryData, { dayTitle: "", activities: "" }]);
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => ({ ...prev, [type]: files }));
  };

  const handleEditSave = async () => {
    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("price", editData.price);
    formData.append("category", editData.category);
    formData.append("nights", editData.nights);
    formData.append("country", editData.country);
    formData.append("tour_summary", editData.tour_summary);

    // Append images
    imageFiles.activityImages.forEach((file, idx) =>
      formData.append(`activity_images[${idx}]`, file)
    );
    imageFiles.destinationImages.forEach((file, idx) =>
      formData.append(`destination_images[${idx}]`, file)
    );
    imageFiles.hotelImages.forEach((file, idx) =>
      formData.append(`hotel_images[${idx}]`, file)
    );
    formData.append("tour_image", imageFiles.tourImage);

    // Itinerary data
    formData.append("itinerary", JSON.stringify(itineraryData));

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tours/${editData._id}`,
        formData
      );
      setTours((prevTours) =>
        prevTours.map((tour) =>
          tour._id === editData._id ? response.data : tour
        )
      );
      Swal.fire("Tour updated successfully!", "", "success");
      handleEditClose();
    } catch (err) {
      console.error("Failed to update tour:", err);
      Swal.fire("Failed to update tour!", "", "error");
    }
  };

  const handleDelete = async (tourId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tour?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/tours/${tourId}`);
      setTours((prevTours) => prevTours.filter((tour) => tour._id !== tourId));
      Swal.fire("Tour deleted successfully!", "", "success");
    } catch (error) {
      console.error("Error deleting tour:", error);
      Swal.fire("Failed to delete tour!", "", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8">All Tours (Admin Panel)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105">
            <img src={tour.tour_image} alt={tour.title} className="h-72 w-full object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold">{tour.title}</h3>
              <p className="text-gray-600 mt-2">{tour.description}</p>
              <p className="text-blue-600 text-lg font-bold mt-4">USD {tour.price ? tour.price.toLocaleString() : "N/A"}</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleEditOpen(tour)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(tour._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editTour && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Tour</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={editData.title || ""}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={editData.price || ""}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={editData.category || ""}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={editData.country || ""}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
              />
              <textarea
                name="tour_summary"
                placeholder="Tour Summary"
                value={editData.tour_summary || ""}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded p-2"
              />

              {/* Image Uploads */}
              <input type="file" onChange={(e) => handleImageUpload(e, "tourImage")} className="w-full" />
              {imageFiles.tourImage && <img src={URL.createObjectURL(imageFiles.tourImage)} alt="Tour" className="w-32 h-32 object-cover mt-2" />}

              {/* Night-wise itinerary */}
              {Array.from({ length: nightCount }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <input
                    type="text"
                    name="dayTitle"
                    value={itineraryData[idx]?.dayTitle || ""}
                    placeholder={`Day ${idx + 1} Title`}
                    onChange={(e) => handleItineraryChange(idx, e)}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <textarea
                    name="activities"
                    value={itineraryData[idx]?.activities || ""}
                    placeholder={`Day ${idx + 1} Activities`}
                    onChange={(e) => handleItineraryChange(idx, e)}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              ))}

              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={handleEditClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTours;
