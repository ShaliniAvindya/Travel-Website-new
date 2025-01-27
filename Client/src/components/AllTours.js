import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const AllTours = () => {
  const [tours, setTours] = useState([]);
  const [editTour, setEditTour] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    nights: "",
    itinerary: {},
    itineraryImages: {},
    itineraryTitles: {},
    tour_image: [],
    inclusions: "",
    exclusions: "",
    tour_summary: "",
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("/api/tours");
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  const handleEditOpen = (tour) => {
    setEditTour(tour);
    setFormData({
      title: tour.title,
      price: tour.price,
      nights: tour.nights,
      itinerary: tour.itinerary || {},
      itineraryImages: tour.itinerary_images || {},
      itineraryTitles: tour.itinerary_titles || {},
      tour_image: Array.isArray(tour.tour_image) ? tour.tour_image : [tour.tour_image],
      inclusions: tour.inclusions.join("\n"),
      exclusions: tour.exclusions.join("\n"),
      tour_summary: tour.tour_summary,
    });
  };

  const handleEditClose = () => {
    setEditTour(null);
    setFormData({
      title: "",
      price: "",
      nights: "",
      itinerary: {},
      itineraryImages: {},
      itineraryTitles: {},
      tour_image: [],
      inclusions: "",
      exclusions: "",
      tour_summary: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItineraryChange = (e, dayKey) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      itinerary: {
        ...prevData.itinerary,
        [dayKey]: value,
      },
    }));
  };

  const handleItineraryTitleChange = (e, dayKey) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      itineraryTitles: {
        ...prevData.itineraryTitles,
        [dayKey]: value,
      },
    }));
  };

  const handleImageUpload = async (e, fieldName, dayKey) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        // Display loading indicator
        const loadingUrl = URL.createObjectURL(file);
        if (dayKey) {
          setFormData((prevData) => ({
            ...prevData,
            itineraryImages: {
              ...prevData.itineraryImages,
              [dayKey]: [...prevData.itineraryImages[dayKey], loadingUrl],
            },
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            [fieldName]: [...prevData[fieldName], loadingUrl],
          }));
        }

        const response = await fetch(`https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Uploaded image URL:', data.data.url); // Log the uploaded URL
        uploadedUrls.push(data.data.url); // Assuming the response contains the URL in `data.data.url`

        // Replace loading indicator with the actual uploaded image URL
        if (dayKey) {
          setFormData((prevData) => ({
            ...prevData,
            itineraryImages: {
              ...prevData.itineraryImages,
              [dayKey]: prevData.itineraryImages[dayKey].map((url) =>
                url === loadingUrl ? data.data.url : url
              ),
            },
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            [fieldName]: prevData[fieldName].map((url) =>
              url === loadingUrl ? data.data.url : url
            ),
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    console.log('Updated formData:', formData); // Log the updated formData
  };

  const handleRemoveImage = (fieldName, index, dayKey) => {
    if (dayKey) {
      setFormData((prevData) => ({
        ...prevData,
        itineraryImages: {
          ...prevData.itineraryImages,
          [dayKey]: prevData.itineraryImages[dayKey].filter((_, i) => i !== index),
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: prevData[fieldName].filter((_, i) => i !== index),
      }));
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        price: formData.price,
        nights: formData.nights,
        tour_summary: formData.tour_summary,
        tour_image: formData.tour_image[0], // Assuming single image URL
        inclusions: formData.inclusions.split('\n'),
        exclusions: formData.exclusions.split('\n'),
        itinerary: formData.itinerary,
        itinerary_images: formData.itineraryImages,
        itinerary_titles: formData.itineraryTitles,
      };

      console.log('Payload:', payload); // Log the payload for debugging

      const response = await axios.put(`/api/tours/${editTour._id}`, payload);

      if (response.status === 200) {
        Swal.fire("Success!", "Tour has been updated successfully.", "success");
        setTours((prevTours) =>
          prevTours.map((tour) =>
            tour._id === editTour._id ? response.data : tour
          )
        );
        setEditTour(null);
      } else {
        throw new Error("Failed to update the tour.");
      }
    } catch (error) {
      console.error("Error updating tour:", error);
      if (error.response && error.response.data) {
        console.error("Server response:", error.response.data);
      }
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/tours/${id}`);
      if (response.status === 200) {
        setTours(tours.filter((tour) => tour._id !== id));
        Swal.fire("Deleted!", "Tour has been deleted.", "success");
      } else {
        throw new Error("Failed to delete the tour.");
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8">All Tours (Admin Panel)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105">
            <img src={tour.tour_image} alt={tour.title} className="h-72 w-full object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold">{tour.title}</h3>
              <p className="text-gray-600 mt-2">{tour.tour_summary}</p>
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="relative w-full max-w-3xl bg-white rounded-lg p-8 shadow-xl transform transition-all scale-100 mt-20">
            <button
              onClick={handleEditClose}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Tour Details</h2>
            <div className="overflow-y-auto max-h-[60vh] space-y-6">
              <div>
                <label className="block text-lg font-medium">Tour Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-lg font-medium">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-lg font-medium">Tour Summary</label>
                <textarea
                  name="tour_summary"
                  value={formData.tour_summary}
                  onChange={handleInputChange}
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Tour summary"
                />
              </div>

              <div>
                <label className="block text-lg font-medium">Tour Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "tour_image")}
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-4">
                  {formData.tour_image.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Tour ${index}`}
                        className="w-48 h-48 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("tour_image", index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium">Nights</label>
                <input
                  type="number"
                  name="nights"
                  min="0"
                  value={formData.nights}
                  onChange={handleInputChange}
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium">Itinerary</label>
                <div className="space-y-6">
                  {Object.keys(formData.itinerary).map((dayKey, index) => (
                    <div key={index} className="space-y-4 border p-4 rounded-md bg-blue-100">
                      <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                        {`Day ${index + 1}`}
                      </span>

                      <div>
                        <input
                          type="text"
                          onChange={(e) => handleItineraryTitleChange(e, dayKey)}
                          className="p-2 w-full border border-gray-300 rounded-md"
                          placeholder={`Title for ${dayKey}`}
                        />
                      </div>

                      <textarea
                        rows="2"
                        placeholder={`Activities for ${dayKey} and use ENTER key for each activity`}
                        value={formData.itinerary[dayKey]}
                        onChange={(e) => handleItineraryChange(e, dayKey)}
                        className="p-2 w-full border border-gray-300 rounded-md"
                      />

                      <div className="space-x-2 mt-4">
                        <input
                          type="file"
                          onChange={(e) => handleImageUpload(e, "", dayKey)}
                          multiple
                          className="p-2 w-full border border-gray-300 rounded-md"
                        />
                        <div className="flex space-x-2 mt-4">
                          {formData.itineraryImages[dayKey] && formData.itineraryImages[dayKey].map((image, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={image}
                                alt={`Day ${index + 1} ${idx}`}
                                className="w-24 h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage("", idx, dayKey)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium">Inclusions</label>
                <textarea
                  name="inclusions"
                  value={formData.inclusions}
                  onChange={handleInputChange}
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="List of inclusions and use ENTER key for each activity"
                />
              </div>

              <div>
                <label className="block text-lg font-medium">Exclusions</label>
                <textarea
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleInputChange}
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="List of exclusions and use ENTER key for each activity"
                />
              </div>

              <div className="flex justify-center mt-5">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
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