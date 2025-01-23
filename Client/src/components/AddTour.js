import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const TourForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    nights: 1,
    itinerary: {}, // Stores activities for each day
    itineraryImages: {}, // Stores images for each day
    itineraryTitles: {}, // Stores titles for each day
    tour_image: "",
    activity_images: [],
    destination_images: [],
    hotel_images: [],
    inclusions: "",
    exclusions: "",
    tour_summary: "",
  });

  const [showItinerary, setShowItinerary] = useState(false);

  // Adjust the itinerary based on the number of nights
  useEffect(() => {
    const numberOfDays = parseInt(formData.nights) + 1; // Days = nights + 1
    const newItinerary = {};
    const newItineraryImages = {};
    const newItineraryTitles = {};
    for (let i = 1; i <= numberOfDays; i++) {
      newItinerary[`day_${i}`] = ""; // Initialize an empty string for each day's activities
      newItineraryImages[`day_${i}`] = []; // Initialize an empty array for images
      newItineraryTitles[`day_${i}`] = `Day ${i} Title`; // Default title
    }
    setFormData((prevData) => ({
      ...prevData,
      itinerary: newItinerary,
      itineraryImages: newItineraryImages,
      itineraryTitles: newItineraryTitles,
    }));
  }, [formData.nights]);

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

  const handleImageUpload = (e, fieldName, dayKey) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));

    if (dayKey) {
      setFormData((prevData) => ({
        ...prevData,
        itineraryImages: {
          ...prevData.itineraryImages,
          [dayKey]: [...prevData.itineraryImages[dayKey], ...newImages],
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: [...prevData[fieldName], ...newImages],
      }));
    }
  };

  const handleRemoveImage = (fieldName, index, dayKey) => {
    if (dayKey) {
      setFormData((prevData) => ({
        ...prevData,
        itineraryImages: {
          ...prevData.itineraryImages,
          [dayKey]: prevData.itineraryImages[dayKey].filter(
            (_, i) => i !== index
          ),
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: prevData[fieldName].filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmitItinerary = () => {
    setShowItinerary(true);
    Swal.fire("Itinerary Submitted!", "Only the itinerary section is displayed.", "success");
  };

  return (
    <div className="bg-blue-200 p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Tour</h2>

      <div className="space-y-6">
        {/* Tour Title */}
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

        {/* Price */}
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

        {/* Nights */}
        <div>
          <label className="block text-lg font-medium">Nights</label>
          <input
            type="number"
            name="nights"
            min="1"
            value={formData.nights}
            onChange={handleInputChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
          <p className="mt-2 text-sm text-gray-500">
            Select the number of nights for the tour.
          </p>
        </div>

        {/* Itinerary Section */}
        {showItinerary ? (
          <div>
            <h3 className="text-xl font-bold text-center mt-6">Itinerary Details</h3>
            <div className="space-y-6">
              {Object.keys(formData.itinerary).map((dayKey, index) => (
                <div
                  key={index}
                  className="space-y-4 border p-4 rounded-md bg-blue-100"
                >
                  <h4 className="bg-blue-500 text-white px-6 py-2 rounded-lg">{`Day ${index + 1}`}</h4>
                  <p className="font-bold">{formData.itineraryTitles[dayKey]}</p>
                  <p>{formData.itinerary[dayKey]}</p>
                  <div className="flex space-x-2">
                    {formData.itineraryImages[dayKey]?.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Day ${index + 1} ${idx}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-lg font-medium">Itinerary</label>
            <div className="space-y-6">
              {Object.keys(formData.itinerary).map((dayKey, index) => (
                <div
                  key={index}
                  className="space-y-4 border p-4 rounded-md bg-blue-100"
                >
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
                    rows="3"
                    placeholder={`Activities for ${dayKey}`}
                    value={formData.itinerary[dayKey]}
                    onChange={(e) => handleItineraryChange(e, dayKey)}
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />

                  <div>
                    <label className="block text-lg font-medium">
                      Upload Images for {dayKey}
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleImageUpload(e, "itineraryImages", dayKey)
                      }
                      className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                    />
                    <div className="flex space-x-2 mt-4">
                      {formData.itineraryImages[dayKey]?.map((image, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={image}
                            alt={`Day ${index + 1} ${idx}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImage("itineraryImages", idx, dayKey)
                            }
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

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleSubmitItinerary}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Submit Itinerary
              </button>
            </div>
          </div>
        )}

        {/* Other Sections (Activity Images, Destination Images, etc.) */}
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
          <label className="block text-lg font-medium">Activity Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "activity_images")}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.activity_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Activity ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage("activity_images", index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Images Section */}
        <div>
          <label className="block text-lg font-medium">Destination Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "destination_images")}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.destination_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Destination ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage("destination_images", index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hotel Images Section */}
        <div>
          <label className="block text-lg font-medium">Hotel Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "hotel_images")}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.hotel_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Hotel ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage("hotel_images", index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash />
                </button>
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
            placeholder="List of inclusions"
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Exclusions</label>
          <textarea
            name="exclusions"
            value={formData.exclusions}
            onChange={handleInputChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            placeholder="List of exclusions"
          />
        </div>

        
      </div>
    </div>
  );
};

export default TourForm;
