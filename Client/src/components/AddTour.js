import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const marketMapping = {
  1: "Indian Market",
  2: "Chinese Market",
  3: "Asian Markets",
  4: "Middle East Markets",
  5: "Russia and CIS Markets",
  6: "Rest of the world",
};

const foodCategoryMapping = {
  0: "Half Board",
  1: "Full Board",
  2: "All Inclusive",
};

const TourForm = () => {
  // Main form state holds the confirmed data for the tour.
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    // Confirmed base nights count (as string). Updated only after confirmation.
    nights: "",
    expiry_date: "",
    valid_from: "",
    valid_to: "",
    food_category: {
      0: [0, 0],
      1: [0, 0],
      2: [0, 0],
    },
    country: "",
    markets: [],
    tour_summary: "",
    oldPrice: "",
    inclusions: "",
    exclusions: "",
    facilities: "",
    tour_image: [],
    destination_images: [],
    activity_images: [],
    hotel_images: [],
    // Itinerary structure: arrival, dynamic middle days, departure.
    itinerary: {
      first_day: "",
      middle_days: {},
      last_day: "",
    },
    itineraryImages: {
      first_day: [],
      middle_days: {},
      last_day: [],
    },
    itineraryTitles: {
      first_day: "",
      middle_days: {},
      last_day: "",
    },
    // Pricing options for each night count (keyed by the confirmed nights count)
    nightsOptions: {},
  });

  // Local state for the "nights option" form (for adding new option pricing)
  const [nightsOptionForm, setNightsOptionForm] = useState({
    option: "",
    add_price: "",
    old_add_price: "",
  });

  // NEW: Local state for the user-entered nights count before confirmation.
  const [nightsInput, setNightsInput] = useState("");

  // Additional states for showing itinerary & errors.
  const [showItinerary, setShowItinerary] = useState(false);
  const [errors, setErrors] = useState({});

  // Basic input change handler for formData.
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for the separate nights input field.
  const handleNightsInputChange = (e) => {
    setNightsInput(e.target.value);
  };

  // Confirm Nights: Validate and update confirmed nights count.
  const handleConfirmNights = () => {
    const newNights = parseInt(nightsInput, 10);
    if (isNaN(newNights) || newNights <= 0) {
      Swal.fire("Error", "Please enter a valid number of nights", "error");
      return;
    }

    // Total days = nights (for stay) + 1 (arrival)
    const totalDays = newNights + 1;
    // Get current middle days from state.
    const currentMiddle = formData.itinerary.middle_days || {};
    const middleKeys = Object.keys(currentMiddle)
      .map((key) => parseInt(key.split("_")[1], 10))
      .filter((num) => !isNaN(num));
    const currentMax = middleKeys.length > 0 ? Math.max(...middleKeys) : 1;

    // If the confirmed nights count is higher than current max, append new days.
    let newItinerary = { ...formData.itinerary };
    let newItineraryImages = { ...formData.itineraryImages };
    let newItineraryTitles = { ...formData.itineraryTitles };

    if (newNights > currentMax) {
      for (let i = currentMax + 1; i <= newNights; i++) {
        const key = `day_${i}`;
        newItinerary.middle_days[key] = "";
        newItineraryImages.middle_days[key] = [];
        newItineraryTitles.middle_days[key] = `Day ${i} Title`;
      }
    }
    // Note: If the new nights count is lower than currentMax, extra days remain in state but won't be displayed.

    // Update formData with the confirmed nights and ensure pricing group exists.
    setFormData((prev) => ({
      ...prev,
      nights: nightsInput,
      itinerary: newItinerary,
      itineraryImages: newItineraryImages,
      itineraryTitles: newItineraryTitles,
      nightsOptions: {
        ...prev.nightsOptions,
        [nightsInput]: prev.nightsOptions[nightsInput] || [],
      },
    }));

    Swal.fire("Success", "Night count confirmed and itinerary updated", "success");
  };

  // Update itinerary text for a section.
  const handleItineraryChange = (e, section, dayKey = null) => {
    const value = e.target.value;
    if (section === "middle_days" && dayKey) {
      setFormData((prevData) => ({
        ...prevData,
        itinerary: {
          ...prevData.itinerary,
          middle_days: {
            ...prevData.itinerary.middle_days,
            [dayKey]: value,
          },
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        itinerary: {
          ...prevData.itinerary,
          [section]: value,
        },
      }));
    }
  };

  // Update itinerary title.
  const handleItineraryTitleChange = (e, section, dayKey = null) => {
    const value = e.target.value;
    if (section === "middle_days" && dayKey) {
      setFormData((prevData) => ({
        ...prevData,
        itineraryTitles: {
          ...prevData.itineraryTitles,
          middle_days: {
            ...prevData.itineraryTitles.middle_days,
            [dayKey]: value,
          },
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        itineraryTitles: {
          ...prevData.itineraryTitles,
          [section]: value,
        },
      }));
    }
  };

  // Image upload handler.
  const handleImageUpload = async (e, key, section) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const formDataImage = new FormData();
      formDataImage.append("image", file);
      const loadingUrl = URL.createObjectURL(file);

      if (section === "middle_days" && key) {
        setFormData((prevData) => ({
          ...prevData,
          itineraryImages: {
            ...prevData.itineraryImages,
            middle_days: {
              ...prevData.itineraryImages.middle_days,
              [key]: [
                ...(Array.isArray(prevData.itineraryImages.middle_days[key])
                  ? prevData.itineraryImages.middle_days[key]
                  : []),
                loadingUrl,
              ],
            },
          },
        }));
      } else if (
        section === "tour_image" ||
        section === "destination_images" ||
        section === "activity_images" ||
        section === "hotel_images"
      ) {
        setFormData((prevData) => ({
          ...prevData,
          [section]: [
            ...(Array.isArray(prevData[section]) ? prevData[section] : []),
            loadingUrl,
          ],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          itineraryImages: {
            ...prevData.itineraryImages,
            [key]: [
              ...(Array.isArray(prevData.itineraryImages[key])
                ? prevData.itineraryImages[key]
                : []),
              loadingUrl,
            ],
          },
        }));
      }

      try {
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39",
          {
            method: "POST",
            body: formDataImage,
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }
        const data = await response.json();
        const uploadedUrl = data.data.url;
        if (section === "middle_days" && key) {
          setFormData((prevData) => ({
            ...prevData,
            itineraryImages: {
              ...prevData.itineraryImages,
              middle_days: {
                ...prevData.itineraryImages.middle_days,
                [key]: (Array.isArray(prevData.itineraryImages.middle_days[key])
                  ? prevData.itineraryImages.middle_days[key]
                  : []).map((url) =>
                  url === loadingUrl ? uploadedUrl : url
                ),
              },
            },
          }));
        } else if (
          section === "tour_images" ||
          section === "destination_images" ||
          section === "activity_images" ||
          section === "hotel_images"
        ) {
          setFormData((prevData) => ({
            ...prevData,
            [section]: (Array.isArray(prevData[section])
              ? prevData[section]
              : []).map((url) =>
              url === loadingUrl ? uploadedUrl : url
            ),
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            itineraryImages: {
              ...prevData.itineraryImages,
              [key]: (Array.isArray(prevData.itineraryImages[key])
                ? prevData.itineraryImages[key]
                : []).map((url) =>
                url === loadingUrl ? uploadedUrl : url
              ),
            },
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Remove image handler.
  const handleRemoveImage = (key, index, section) => {
    if (section === "middle_days") {
      setFormData((prevData) => ({
        ...prevData,
        itineraryImages: {
          ...prevData.itineraryImages,
          middle_days: {
            ...prevData.itineraryImages.middle_days,
            [key]: Array.isArray(prevData.itineraryImages.middle_days[key])
              ? prevData.itineraryImages.middle_days[key].filter((_, i) => i !== index)
              : [],
          },
        },
      }));
    } else if (
      section === "tour_images" ||
      section === "destination_images" ||
      section === "activity_images" ||
      section === "hotel_images"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        [section]: Array.isArray(prevData[section])
          ? prevData[section].filter((_, i) => i !== index)
          : [],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        itineraryImages: {
          ...prevData.itineraryImages,
          [key]: Array.isArray(prevData.itineraryImages[key])
            ? prevData.itineraryImages[key].filter((_, i) => i !== index)
            : [],
        },
      }));
    }
  };

  // Handle changes for the nights option input (for adding new pricing).
  const handleNightsOptionInputChange = (e) => {
    setNightsOptionForm({
      ...nightsOptionForm,
      [e.target.name]: e.target.value,
    });
  };

  // Add a new nights option for the current confirmed nights.
  const addNightsOption = () => {
    if (!formData.nights) {
      Swal.fire("Error", "Please confirm the number of nights first.", "error");
      return;
    }
    const key = formData.nights.toString();
    const newOption = { ...nightsOptionForm };
    if (!newOption.option || !newOption.add_price || !newOption.old_add_price) {
      Swal.fire("Error", "Please fill in all fields for the nights option.", "error");
      return;
    }
    setFormData((prevData) => {
      const currentOptions = prevData.nightsOptions[key] || [];
      return {
        ...prevData,
        nightsOptions: {
          ...prevData.nightsOptions,
          [key]: [...currentOptions, newOption],
        },
      };
    });
    // Reset the nights option form.
    setNightsOptionForm({
      option: "",
      add_price: "",
      old_add_price: "",
    });
  };

  // Remove a nights option.
  const removeNightsOption = (nightsKey, index) => {
    setFormData((prevData) => ({
      ...prevData,
      nightsOptions: {
        ...prevData.nightsOptions,
        [nightsKey]: prevData.nightsOptions[nightsKey].filter((_, i) => i !== index),
      },
    }));
  };

  // Validate required fields.
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
    if (!formData.itinerary.first_day) {
      newErrors.first_day = "Arrival day itinerary is required.";
      isValid = false;
    }
    if (!formData.itinerary.last_day) {
      newErrors.last_day = "Departure day itinerary is required.";
      isValid = false;
    }
    Object.keys(formData.itinerary.middle_days).forEach((dayKey) => {
      if (!formData.itinerary.middle_days[dayKey]) {
        newErrors[dayKey] = `Itinerary for ${dayKey} is required.`;
        isValid = false;
      }
    });
    // Validate nights options: require at least one option for the confirmed night.
    if (
      formData.nights &&
      (!formData.nightsOptions[formData.nights.toString()] ||
        formData.nightsOptions[formData.nights.toString()].length === 0)
    ) {
      newErrors.nightsOptions = "Please add at least one nights option.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitItinerary = () => {
    if (validateForm()) {
      setShowItinerary(true);
      Swal.fire("Itinerary Submitted!", "Itinerary section submitted successfully.", "success");
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
      valid_from: "",
      valid_to: "",
      food_category: {
        0: [0, 0],
        1: [0, 0],
        2: [0, 0],
      },
      country: "",
      markets: [],
      tour_summary: "",
      oldPrice: "",
      inclusions: "",
      exclusions: "",
      facilities: "",
      tour_image: [],
      destination_images: [],
      activity_images: [],
      hotel_images: [],
      itinerary: {
        first_day: "",
        middle_days: {},
        last_day: "",
      },
      itineraryImages: {
        first_day: [],
        middle_days: {},
        last_day: [],
      },
      itineraryTitles: {
        first_day: "",
        middle_days: {},
        last_day: "",
      },
      nightsOptions: {},
    });
    setShowItinerary(false);
    setErrors({});
    setNightsInput("");
  };

  const handleSubmitTour = async () => {
    if (validateForm()) {
      try {
        const payload = {
          title: formData.title,
          price: formData.price,
          nights: formData.nightsOptions,
          expiry_date: formData.expiry_date,
          valid_from: formData.valid_from,
          valid_to: formData.valid_to,
          food_category: formData.food_category,
          country: formData.country,
          markets: formData.markets,
          tour_summary: formData.tour_summary,
          tour_image: formData.tour_image[0],
          destination_images: formData.destination_images,
          activity_images: formData.activity_images,
          hotel_images: formData.hotel_images,
          inclusions: formData.inclusions.split("\n"),
          exclusions: formData.exclusions.split("\n"),
          facilities: formData.facilities.split("\n"),
          itinerary: formData.itinerary,
          itinerary_images: formData.itineraryImages,
          itinerary_titles: formData.itineraryTitles,
          oldPrice: formData.oldPrice,
        };

        console.log("Payload:", JSON.stringify(payload));

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

  const handleFoodCategoryChange = (catKey, index, val) => {
    const parsedVal = parseInt(val, 10) || 0;
    setFormData((prev) => {
      const oldArray = prev.food_category[catKey] || [0, 0];
      const newArray = [...oldArray];
      newArray[index] = parsedVal;
      return {
        ...prev,
        food_category: {
          ...prev.food_category,
          [catKey]: newArray,
        },
      };
    });
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
        
        <div className="grid grid-cols-3 gap-4">
          {/* Expiry Date */}
          <div>
            <label className="block text-lg font-medium">Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleInputChange}
              className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Valid From */}
          <div>
            <label className="block text-lg font-medium">Valid From</label>
            <input
              type="date"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleInputChange}
              className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {/* Valid To */}
          <div>
            <label className="block text-lg font-medium">Valid To</label>
            <input
              type="date"
              name="valid_to"
              value={formData.valid_to}
              onChange={handleInputChange}
              className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        {/* Food Category Pricing */}
        <div>
          <label className="block text-lg font-medium">Food Category Pricing</label>
          {Object.entries(foodCategoryMapping).map(([key, label]) => (
            <div key={key} className="border p-4 rounded-md my-2">
              <h4 className="font-bold">{label}</h4>
              <div className="flex space-x-4 mt-2">
                <div>
                  <label className="block text-sm">Add Price</label>
                  <input
                    type="number"
                    name={`food_category_${key}_add_price`}
                    value={formData.food_category[key]?.[0] || ""}
                    onChange={(e) =>
                      handleFoodCategoryChange(key, 0, e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm">Old Add Price</label>
                  <input
                    type="number"
                    name={`food_category_${key}_old_add_price`}
                    value={formData.food_category[key]?.[1] || ""}
                    onChange={(e) =>
                      handleFoodCategoryChange(key, 1, e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Country */}
        <div>
          <label className="block text-lg font-medium">Country</label>
          <textarea
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Country"
          />
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
                    const numericValue = Number(e.target.value);
                    setFormData((prevData) => ({
                      ...prevData,
                      markets: e.target.checked
                        ? [...prevData.markets, numericValue]
                        : prevData.markets.filter((m) => m !== numericValue),
                    }));
                  }}
                />
                <label>{value}</label>
              </div>
            ))}
          </div>
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

        {/* Tour Image */}
        <div>
          <label className="block text-lg font-medium">Tour Image <span className="text-gray-500/50 text-sm"> (Size 1×1)</span></label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "tour_image", "tour_image")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.tour_image.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Tour Image ${index}`} className="w-48 h-48 object-cover rounded" />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      tour_image: prevData.tour_image.filter((_, i) => i !== index),
                    }))
                  }
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
          <label className="block text-lg font-medium">Destination Images <span className="text-gray-500/50 text-sm"> (Size 3×2)</span></label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "destination_images", "destination_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.destination_images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Destination Image ${index}`} className="w-48 h-48 object-cover rounded" />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      destination_images: prevData.destination_images.filter((_, i) => i !== index),
                    }))
                  }
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
          <label className="block text-lg font-medium">Activity Images <span className="text-gray-500/50 text-sm"> (Size 3×2)</span></label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "activity_images", "activity_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.activity_images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Activity Image ${index}`} className="w-48 h-48 object-cover rounded" />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      activity_images: prevData.activity_images.filter((_, i) => i !== index),
                    }))
                  }
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
          <label className="block text-lg font-medium">Hotel Images <span className="text-gray-500/50 text-sm"> (Size 3×2)</span></label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e, "hotel_images", "hotel_images")}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
          />
          <div className="flex space-x-2 mt-4">
            {formData.hotel_images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Hotel Image ${index}`} className="w-48 h-48 object-cover rounded" />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      hotel_images: prevData.hotel_images.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- Nights (for itinerary generation) --- */}
        {/* Instead of immediately updating itinerary on every change, we let the user enter a nights count
            into a separate field (nightsInput) and then click "Confirm Nights" to update the itinerary. */}
        <div>
          <label className="block text-lg font-medium">Number of Nights</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={nightsInput}
              onChange={handleNightsInputChange}
              className="mt-0 p-2 w-10/12 border border-gray-300 rounded-md"
              placeholder="Enter number of nights"
            />
            <button
              type="button"
              onClick={handleConfirmNights}
              className="bg-blue-500 text-white px-4 py-2 w-2/12 rounded-md"
            >
              Confirm Nights
            </button>
          </div>
          <p className="mt-0 text-sm text-gray-500">
            Confirm to generate itinerary days and create pricing options.
          </p>
          {errors.nights && <p className="text-red-500 text-sm">{errors.nights}</p>}
        </div>

        {/* --- Nights Options (Add-on Pricing) Section --- */}
        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-xl font-bold mb-4">
            Nights Options (Add-on Pricing) for {formData.nights} nights
          </h3>
          {errors.nightsOptions && <p className="text-red-500 text-sm">{errors.nightsOptions}</p>}
          {formData.nights ? (
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    name="option"
                    value={nightsOptionForm.option}
                    onChange={handleNightsOptionInputChange}
                    placeholder="Option description"
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="add_price"
                    value={nightsOptionForm.add_price}
                    onChange={handleNightsOptionInputChange}
                    placeholder="Add Price"
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="old_add_price"
                    value={nightsOptionForm.old_add_price}
                    onChange={handleNightsOptionInputChange}
                    placeholder="Old Add Price"
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <button onClick={addNightsOption} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Add Option
                  </button>
                </div>
              </div>
              {formData.nightsOptions[formData.nights.toString()] && (
                <div className="mt-4">
                  <h4 className="font-bold">Current Options:</h4>
                  <ul>
                    {formData.nightsOptions[formData.nights.toString()].map((opt, idx) => (
                      <li key={idx} className="flex justify-between items-center border p-2 rounded-md my-1">
                        <span>
                          {opt.option} - Add Price: {opt.add_price}, Old Add Price: {opt.old_add_price}
                        </span>
                        <button onClick={() => removeNightsOption(formData.nights.toString(), idx)} className="bg-red-500 text-white px-2 py-1 rounded">
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>Please confirm the number of nights above to add options.</p>
          )}
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-lg font-medium">Facilities</label>
          <textarea
            name="facilities"
            value={formData.facilities}
            onChange={handleInputChange}
            className="mt-0 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter facilities, one per line"
          />
        </div>

        {/* Itinerary Section */}
        {!showItinerary ? (
          <div>
            <label className="block text-lg font-medium">Itinerary</label>
            <div className="space-y-6">
              {/* Arrival Day */}
              <div className="border p-4 rounded-md bg-blue-100">
                <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">Arrival Day</span>
                <div>
                  <input
                    type="text"
                    value={formData.itineraryTitles.first_day}
                    onChange={(e) => handleItineraryTitleChange(e, "first_day")}
                    placeholder="Title for Arrival Day"
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />
                </div>
                <textarea
                  rows="2"
                  placeholder="Activities for Arrival Day (use ENTER for each activity)"
                  value={formData.itinerary.first_day}
                  onChange={(e) => handleItineraryChange(e, "first_day")}
                  className="p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="space-x-2 mt-4">
                  <span className="text-gray-500/50 text-sm"> (Size 3×2)</span>
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, "first_day", "first_day")}
                    multiple
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2 mt-4">
                    {formData.itineraryImages.first_day.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Arrival Day Image ${index}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("first_day", index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Days */}
              {Object.keys(formData.itinerary.middle_days)
                .sort(
                  (a, b) =>
                    parseInt(a.split("_")[1], 10) - parseInt(b.split("_")[1], 10)
                )
                .map((dayKey) => (
                  <div key={dayKey} className="border p-4 rounded-md bg-blue-100 my-4">
                    <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                      {`Day ${dayKey.split("_")[1]}`}
                    </span>
                    <div>
                      <input
                        type="text"
                        value={formData.itineraryTitles.middle_days[dayKey]}
                        onChange={(e) => handleItineraryTitleChange(e, "middle_days", dayKey)}
                        placeholder={`Title for Day ${dayKey.split("_")[1]}`}
                        className="p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <textarea
                      rows="2"
                      placeholder={`Activities for Day ${dayKey.split("_")[1]} (use ENTER for each activity)`}
                      value={formData.itinerary.middle_days[dayKey]}
                      onChange={(e) => handleItineraryChange(e, "middle_days", dayKey)}
                      className="p-2 w-full border border-gray-300 rounded-md"
                    />
                    <div className="space-x-2 mt-4">
                      <span className="text-gray-500/50 text-sm"> (Size 3×2)</span>
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, dayKey, "middle_days")}
                        multiple
                        className="p-2 w-full border border-gray-300 rounded-md"
                      />
                      <div className="flex space-x-2 mt-4">
                        {formData.itineraryImages.middle_days[dayKey]?.map((image, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={image}
                              alt={`Day ${dayKey.split("_")[1]} Image ${idx}`}
                              className="w-24 h-24 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(dayKey, idx, "middle_days")}
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

              {/* Departure Day */}
              <div className="border p-4 rounded-md bg-blue-100">
                <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">Departure Day</span>
                <div>
                  <input
                    type="text"
                    value={formData.itineraryTitles.last_day}
                    onChange={(e) => handleItineraryTitleChange(e, "last_day")}
                    placeholder="Title for Departure Day"
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />
                </div>
                <textarea
                  rows="2"
                  placeholder="Activities for Departure Day (use ENTER for each activity)"
                  value={formData.itinerary.last_day}
                  onChange={(e) => handleItineraryChange(e, "last_day")}
                  className="p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="space-x-2 mt-4">
                  <span className="text-gray-500/50 text-sm"> (Size 3×2)</span>
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, "last_day", "last_day")}
                    multiple
                    className="p-2 w-full border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2 mt-4">
                    {formData.itineraryImages.last_day.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Departure Day Image ${index}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("last_day", index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary Submit and Reset */}
            <div className="flex justify-between mt-4">
              <button onClick={handleSubmitItinerary} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                Submit Itinerary
              </button>
              <button onClick={handleResetItinerary} className="bg-gray-500 text-white px-6 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-center mt-6">Itinerary Details</h3>
            <div className="space-y-6">
              {/* Display Arrival Day */}
              <div className="border p-4 rounded-md bg-blue-100">
                <h4 className="bg-blue-500 text-white px-6 py-2 rounded-lg">Arrival Day</h4>
                <p className="font-bold">{formData.itineraryTitles.first_day}</p>
                <p>{formData.itinerary.first_day}</p>
                <div className="flex space-x-2">
                  {formData.itineraryImages.first_day.map((image, index) => (
                    <img key={index} src={image} alt={`Arrival Day Image ${index}`} className="w-24 h-24 object-cover rounded" />
                  ))}
                </div>
              </div>
              {/* Display Middle Days */}
              {Object.keys(formData.itinerary.middle_days).map((dayKey) => (
                <div key={dayKey} className="border p-4 rounded-md bg-blue-100">
                  <h4 className="bg-blue-500 text-white px-6 py-2 rounded-lg">{`Day ${dayKey.split("_")[1]}`}</h4>
                  <p className="font-bold">{formData.itineraryTitles.middle_days[dayKey]}</p>
                  <p>{formData.itinerary.middle_days[dayKey]}</p>
                  <div className="flex space-x-2">
                    {formData.itineraryImages.middle_days[dayKey]?.map((image, idx) => (
                      <img key={idx} src={image} alt={`Day ${dayKey.split("_")[1]} Image ${idx}`} className="w-24 h-24 object-cover rounded" />
                    ))}
                  </div>
                </div>
              ))}
              {/* Display Departure Day */}
              <div className="border p-4 rounded-md bg-blue-100">
                <h4 className="bg-blue-500 text-white px-6 py-2 rounded-lg">Departure Day</h4>
                <p className="font-bold">{formData.itineraryTitles.last_day}</p>
                <p>{formData.itinerary.last_day}</p>
                <div className="flex space-x-2">
                  {formData.itineraryImages.last_day.map((image, index) => (
                    <img key={index} src={image} alt={`Departure Day Image ${index}`} className="w-24 h-24 object-cover rounded" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={handleResetItinerary} className="bg-gray-500 text-white px-6 py-2 rounded-lg">
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
            placeholder="List of inclusions (ENTER for each item)"
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
            placeholder="List of exclusions (ENTER for each item)"
          />
        </div>

        {/* Submit Tour Button */}
        <div className="flex justify-center mt-5">
          <button
            type="button"
            onClick={handleSubmitTour}
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
