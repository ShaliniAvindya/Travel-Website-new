import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const marketMapping = {
  1: 'Indian Market',
  2: 'Chinese Market',
  3: 'Asian Markets',
  4: 'Middle East Markets',
  5: 'Russia and CIS Markets',
  6: 'All Markets'
};

const TourForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    nights: "",
    expiry_date: "",
    country: "",
    markets: [],
    itinerary: {}, // Stores activities for each day
    itineraryImages: {}, // Stores images for each day
    itineraryTitles: {}, // Stores titles for each day
    tour_image: [],
    destination_images: [],
    activity_images: [],
    hotel_images: [],
    inclusions: "",
    exclusions: "",
    tour_summary: "",
    oldPrice: "",
  });

  const [showItinerary, setShowItinerary] = useState(false);
  const [showRestItinerary, setShowRestItinerary] = useState(false);
  const [isItinerarySubmitted, setIsItinerarySubmitted] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title) {
      newErrors.title = "Tour title is required.";
      isValid = false;
    }
    if (!formData.price) {
      newErrors.price = "Price is required.";
      isValid = false;
    }
    if (!formData.nights || formData.nights <= 0) {
      newErrors.nights = "Number of nights is required.";
      isValid = false;
    }
    if (!formData.tour_summary) {
      newErrors.tour_summary = "Tour summary is required.";
      isValid = false;
    }
    if (formData.tour_image.length === 0) {
      newErrors.tour_image = "At least one tour image is required.";
      isValid = false;
    }

    // Check itinerary for each day
    Object.keys(formData.itinerary).forEach((dayKey) => {
      if (!formData.itinerary[dayKey]) {
        newErrors[dayKey] = "Activities for this day are required.";
        isValid = false;
      }
      if (!formData.itineraryTitles[dayKey]) {
        newErrors[`${dayKey}_title`] = "Title for this day is required.";
        isValid = false;
      }
      if (formData.itineraryImages[dayKey].length === 0) {
        newErrors[`${dayKey}_images`] = "At least one image is required.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitItinerary = () => {
    if (validateForm()) {
      setShowItinerary(true);
      setIsItinerarySubmitted(true); // Set itinerary as submitted
      Swal.fire("Itinerary Submitted!", "Only the itinerary section is displayed.", "success");
    } else {
      Swal.fire("Error", "Please fill out all required fields.", "error");
    }
  };

  const handleResetItinerary = () => {
    setFormData({
      title: "",
      price: "",
      nights: "",
      expiry_date: "",
      country: "",
      markets: [],
      itinerary: {},
      itineraryImages: {},
      itineraryTitles: {},
      tour_image: [],
      destination_images: [],
      activity_images: [],
      hotel_images: [],
      inclusions: "",
      exclusions: "",
      tour_summary: "",
      oldPrice: "",
    });
    setShowItinerary(false);
    setShowRestItinerary(false);
    setErrors({});
    setIsItinerarySubmitted(false); 
  };

  const handleShowRestItinerary = () => {
    setShowRestItinerary((prevState) => !prevState);
  };

  const handleSubmitTour = async () => {
  const isValid = validateForm();
  if (isValid) {
    try {
      const payload = {
        title: formData.title,
        price: formData.price,
        nights: formData.nights,
        expiry_date: formData.expiry_date,
        country: formData.country,
        markets: formData.markets,
        tour_summary: formData.tour_summary,
        tour_image: formData.tour_image[0], 
        destination_images: formData.destination_images,
        activity_images: formData.activity_images,
        hotel_images: formData.hotel_images,
        inclusions: formData.inclusions.split('\n'),
        exclusions: formData.exclusions.split('\n'),
        itinerary: formData.itinerary,
        itinerary_images: formData.itineraryImages,
        itinerary_titles: formData.itineraryTitles,
        oldPrice: formData.oldPrice,
      };

      const response = await fetch("/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Swal.fire("Success!", "Tour has been created successfully.", "success");
        handleResetItinerary();
      } else {
        const errorData = await response.json();
        console.error("Response error:", errorData);
        throw new Error(errorData.message || "Failed to create the tour.");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", error.message, "error");
    }
  } else {
    Swal.fire("Error", "Please fill out all required fields.", "error");
  }
};

  return (
    <div className="bg-white min-h-screen p-0">
      <h2 className="text-5xl font-bold text-center mb-8">Add New Tour</h2>

      <div className="space-y-6">
        {/* Tour Title */}
        <div>
          <label className="block text-lg font-medium">Tour Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-lg font-medium">Price (USD)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          {errors.expiry_date && <p className="text-red-500 text-sm">{errors.expiry_date}</p>}
        </div>

        {/* Markets */}
        <div>
          <label className="block text-lg font-medium">Markets</label>
          <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
            {Object.entries(marketMapping).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  name="markets"
                  value={key}
                  checked={formData.markets.includes(Number(key))}
                  onChange={(e) => {
                    const { checked, value } = e.target;
                    const numericValue = Number(value);
                    setFormData((prevData) => ({
                      ...prevData,
                      markets: checked
                        ? [...prevData.markets, numericValue]
                        : prevData.markets.filter((market) => market !== numericValue),
                    }));
                  }}
                />
                <label>{value}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium">Country</label>
          <textarea
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Country"
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>

        {/* Tour Summary */}
        <div>
          <label className="block text-lg font-medium">Tour Summary</label>
          <textarea
            name="tour_summary"
            value={formData.tour_summary}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Tour summary"
          />
          {errors.tour_summary && <p className="text-red-500 text-sm">{errors.tour_summary}</p>}
        </div>

        {/* Tour Image Section */}
        <div>
          <label className="block text-lg font-medium">Tour Image</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "tour_image")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.tour_image.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Tour Image ${index}`}
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

        {/* Destination Images */}
        <div>
          <label className="block text-lg font-medium">Destination Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "destination_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.destination_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Destination Image ${index}`}
                  className="w-48 h-48 object-cover rounded"
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

        {/* Activity Images */}
        <div>
          <label className="block text-lg font-medium">Activity Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "activity_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.activity_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                 src={image}
                  alt={`Activity Image ${index}`}
                  className="w-48 h-48 object-cover rounded"
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

        {/* Hotel Images */}
        <div>
          <label className="block text-lg font-medium">Hotel Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "hotel_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.hotel_images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Hotel Image ${index}`}
                  className="w-48 h-48 object-cover rounded"
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

        {/* Nights */}
        <div>
          <label className="block text-lg font-medium">Nights</label>
          <input
            type="number"
            name="nights"
            min="0"
            value={formData.nights}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            required
          />
          {errors.nights && <p className="text-red-500 text-sm">{errors.nights}</p>}
          <p className="mt-0 text-sm text-gray-500">
            Enter the number of nights to generate the itinerary section.
          </p>
        </div>

        {/* Itinerary Section */}
        {!showItinerary ? (
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
                      {formData.itineraryImages[dayKey].map((image, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={image}
                            alt={`Day ${index + 1} Image ${idx}`}
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

            {/* Submit and Reset Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSubmitItinerary}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
              >
                Submit Itinerary
              </button>
              <button
                onClick={handleResetItinerary}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-center mt-6">Itinerary Details</h3>
            <div className="space-y-6">
              {Object.keys(formData.itinerary).map((dayKey, index) => (
                <div key={index} className="space-y-4 border p-4 rounded-md bg-blue-100">
                  <h4 className="bg-blue-500 text-white px-6 py-2 rounded-lg">{`Day ${index + 1}`}</h4>
                  <p className="font-bold">{formData.itineraryTitles[dayKey]}</p>
                  <p>{formData.itinerary[dayKey]}</p>
                  <div className="flex space-x-2">
                    {formData.itineraryImages[dayKey]?.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Day ${index + 1} Image ${idx}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Show Reset button after itinerary has been submitted */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleResetItinerary}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Inclusions */}
        <div>
          <label className="block text-lg font-medium">Inclusions</label>
          <textarea
            name="inclusions"
            value={formData.inclusions}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="List of inclusions and use ENTER key for each activity"
          />
        </div>

        {/* Exclusions */}
        <div>
          <label className="block text-lg font-medium">Exclusions</label>
          <textarea
            name="exclusions"
            value={formData.exclusions}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="List of exclusions and use ENTER key for each activity"
          />
        </div>

        {/* Old Price */}
        <div>
          <label className="block text-lg font-medium">Old Price (Optional)</label>
          <input
            type="text"
            name="oldPrice"
            value={formData.oldPrice}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>


        {/* Submit Tour Button */}
        <div className="flex justify-center mt-5">
          <button
            type="button"  // Change type to "button" to prevent form submission
            onClick={handleSubmitTour} // Call handleSubmitTour when clicked
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Submit Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourForm;