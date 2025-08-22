import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";

const marketMapping = {
  1: "Indian Market",
  2: "Chinese Market",
  3: "Asian Markets",
  4: "Middle East Markets",
  5: "Russia and CIS Markets",
  6: "Rest of the World",
};

const foodCategoryMapping = {
  0: "Half Board",
  1: "Full Board",
  2: "All Inclusive",
};

const TourForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    oldPrice: "",
    person_count: "",
    days: "",
    expiry_date: "",
    valid_from: "",
    valid_to: "",
    food_category: {
      0: [0, 0, false],
      1: [0, 0, false],
      2: [0, 0, false],
    },
    nights: {},
    country: "",
    markets: [],
    sum: "", 
    tour_summary: "",
    inclusions: "",
    exclusions: "",
    facilities: "",
    tour_image: "",
    destination_images: [],
    activity_images: [],
    hotel_images: [],
    itinerary: {
      first_day: "",
      middle_days: {},
      last_day: "",
    },
    itinerary_titles: {
      first_day: "",
      middle_days: {},
      last_day: "",
    },
    itinerary_images: {
      first_day: [],
      middle_days: {},
      last_day: [],
    },
    category: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMarketsChange = (e) => {
    const { checked, value } = e.target;
    const numericValue = Number(value);
    setFormData((prev) => ({
      ...prev,
      markets: checked
        ? [...prev.markets, numericValue]
        : prev.markets.filter((m) => m !== numericValue),
    }));
  };

  const handleFoodCategoryChange = (catKey, index, val) => {
    const parsedVal = parseInt(val, 10) || 0;
    setFormData((prev) => {
      const oldArray = prev.food_category[catKey] || [0, 0, false];
      const newArray = [...oldArray];
      newArray[index] = parsedVal;
      return { ...prev, food_category: { ...prev.food_category, [catKey]: newArray } };
    });
  };

  const handleFoodCategoryCheckboxChange = (catKey, checked) => {
    setFormData((prev) => {
      const oldArray = prev.food_category[catKey] || [0, 0, false];
      const newArray = [...oldArray];
      newArray[2] = checked;
      return { ...prev, food_category: { ...prev.food_category, [catKey]: newArray } };
    });
  };

  const handleNightsChange = (nightsKey, type, field, value) => {
    const parsedValue = field === "option" ? value : parseInt(value, 10) || 0;
    setFormData((prev) => ({
      ...prev,
      nights: {
        ...prev.nights,
        [nightsKey]: {
          ...prev.nights[nightsKey],
          [type]: {
            ...prev.nights[nightsKey]?.[type] || { option: "", add_price: 0, old_add_price: 0 },
            [field]: parsedValue,
          },
        },
      },
    }));
  };

  const handleAddNightOption = () => {
    Swal.fire({
      title: "Add Night Option",
      input: "number",
      inputLabel: "Number of Nights",
      inputPlaceholder: "Enter number of nights (e.g., 5)",
      showCancelButton: true,
      confirmButtonText: "Add",
      inputValidator: (value) => {
        if (!value || isNaN(value) || parseInt(value) <= 0) {
          return "Please enter a valid number of nights";
        }
        if (formData.nights[value]) {
          return "This night option already exists";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const nightsKey = result.value;
        setFormData((prev) => ({
          ...prev,
          nights: {
            ...prev.nights,
            [nightsKey]: {
              standard: { option: "", add_price: 0, old_add_price: 0 },
              premium: { option: "", add_price: 0, old_add_price: 0 },
            },
          },
        }));
        Swal.fire("Success", `${nightsKey} nights option added`, "success");
      }
    });
  };

  const handleRemoveNightOption = (nightsKey) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Remove ${nightsKey} nights option?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData((prev) => {
          const newNights = { ...prev.nights };
          delete newNights[nightsKey];
          return { ...prev, nights: newNights };
        });
        Swal.fire("Removed!", `${nightsKey} nights option has been removed.`, "success");
      }
    });
  };

  const handleItineraryChange = (e, section, dayKey = null) => {
    const value = e.target.value;
    if (section === "middle_days" && dayKey) {
      setFormData((prev) => ({
        ...prev,
        itinerary: {
          ...prev.itinerary,
          middle_days: { ...prev.itinerary.middle_days, [dayKey]: value },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        itinerary: { ...prev.itinerary, [section]: value },
      }));
    }
  };

  const handleItineraryTitleChange = (e, section, dayKey = null) => {
    const value = e.target.value;
    if (section === "middle_days" && dayKey) {
      setFormData((prev) => ({
        ...prev,
        itinerary_titles: {
          ...prev.itinerary_titles,
          middle_days: { ...prev.itinerary_titles.middle_days, [dayKey]: value },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        itinerary_titles: { ...prev.itinerary_titles, [section]: value },
      }));
    }
  };

  const handleImageUpload = async (e, key, section) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const previewUrl = URL.createObjectURL(file);
      if (section === "middle_days" && key) {
        setFormData((prev) => ({
          ...prev,
          itinerary_images: {
            ...prev.itinerary_images,
            middle_days: {
              ...prev.itinerary_images.middle_days,
              [key]: [...(prev.itinerary_images.middle_days[key] || []), previewUrl],
            },
          },
        }));
      } else if (
        section === "tour_image" ||
        section === "destination_images" ||
        section === "activity_images" ||
        section === "hotel_images"
      ) {
        setFormData((prev) => ({
          ...prev,
          [section]: section === "tour_image" ? previewUrl : [...prev[section], previewUrl],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          itinerary_images: {
            ...prev.itinerary_images,
            [key]: [...(prev.itinerary_images[key] || []), previewUrl],
          },
        }));
      }
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("image", file);
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39",
          { method: "POST", body: formDataToSend }
        );
        if (!response.ok) throw new Error(`Failed to upload image: ${response.statusText}`);
        const data = await response.json();
        const finalUrl = data.data.url;
        if (section === "middle_days" && key) {
          setFormData((prev) => ({
            ...prev,
            itinerary_images: {
              ...prev.itinerary_images,
              middle_days: {
                ...prev.itinerary_images.middle_days,
                [key]: prev.itinerary_images.middle_days[key].map((url) =>
                  url === previewUrl ? finalUrl : url
                ),
              },
            },
          }));
        } else if (
          section === "tour_image" ||
          section === "destination_images" ||
          section === "activity_images" ||
          section === "hotel_images"
        ) {
          setFormData((prev) => ({
            ...prev,
            [section]: section === "tour_image" ? finalUrl : prev[section].map((url) =>
              url === previewUrl ? finalUrl : url
            ),
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            itinerary_images: {
              ...prev.itinerary_images,
              [key]: prev.itinerary_images[key].map((url) =>
                url === previewUrl ? finalUrl : url
              ),
            },
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire("Error", "Failed to upload image.", "error");
      }
    }
  };

  const handleRemoveImage = (key, index, section) => {
    if (section === "middle_days" && key) {
      setFormData((prev) => ({
        ...prev,
        itinerary_images: {
          ...prev.itinerary_images,
          middle_days: {
            ...prev.itinerary_images.middle_days,
            [key]: prev.itinerary_images.middle_days[key].filter((_, i) => i !== index),
          },
        },
      }));
    } else if (
      section === "destination_images" ||
      section === "activity_images" ||
      section === "hotel_images"
    ) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      }));
    } else if (section === "tour_image") {
      setFormData((prev) => ({ ...prev, tour_image: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        itinerary_images: {
          ...prev.itinerary_images,
          [key]: prev.itinerary_images[key].filter((_, i) => i !== index),
        },
      }));
    }
  };

  const handleConfirmDays = () => {
    const newDays = parseInt(formData.days, 10);
    if (isNaN(newDays) || newDays <= 0) {
      setErrors((prev) => ({ ...prev, days: "Please enter a valid number of days" }));
      return;
    }
    const totalDays = newDays - 2; 
    let newItinerary = { ...formData.itinerary };
    let newItineraryImages = { ...formData.itinerary_images };
    let newItineraryTitles = { ...formData.itinerary_titles };
    const currentMiddle = Object.keys(formData.itinerary.middle_days)
      .map((key) => parseInt(key.split("_")[1], 10))
      .filter((num) => !isNaN(num));
    const currentMax = currentMiddle.length > 0 ? Math.max(...currentMiddle) : 0;

    if (totalDays > currentMax) {
      for (let i = currentMax + 1; i <= totalDays; i++) {
        const key = `day_${i}`;
        newItinerary.middle_days[key] = "";
        newItineraryImages.middle_days[key] = [];
        newItineraryTitles.middle_days[key] = `Day ${i} Title`;
      }
    } else if (totalDays < currentMax) {
      const newMiddleDays = {};
      const newMiddleImages = {};
      const newMiddleTitles = {};
      for (let i = 1; i <= totalDays; i++) {
        const key = `day_${i}`;
        newMiddleDays[key] = formData.itinerary.middle_days[key] || "";
        newMiddleImages[key] = formData.itinerary_images.middle_days[key] || [];
        newMiddleTitles[key] = formData.itinerary_titles.middle_days[key] || `Day ${i} Title`;
      }
      newItinerary.middle_days = newMiddleDays;
      newItineraryImages.middle_days = newMiddleImages;
      newItineraryTitles.middle_days = newMiddleTitles;
    }

    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
      itinerary_images: newItineraryImages,
      itinerary_titles: newItineraryTitles,
    }));
    setErrors((prev) => ({ ...prev, days: undefined }));
    Swal.fire("Success", "Day count confirmed and itinerary updated", "success");
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
    if (!formData.days || formData.days <= 0) {
      newErrors.days = "Number of days is required.";
      isValid = false;
    }
    if (!formData.expiry_date) {
      newErrors.expiry_date = "Expiry date is required.";
      isValid = false;
    }
    if (!formData.valid_from) {
      newErrors.valid_from = "Valid from date is required.";
      isValid = false;
    }
    if (!formData.valid_to) {
      newErrors.valid_to = "Valid to date is required.";
      isValid = false;
    }
    if (!formData.country) {
      newErrors.country = "Country is required.";
      isValid = false;
    }
    if (!formData.sum) {
      newErrors.sum = "Short summary is required.";
      isValid = false;
    }
    if (!formData.tour_summary) {
      newErrors.tour_summary = "Tour summary is required.";
      isValid = false;
    }
    if (!formData.tour_image) {
      newErrors.tour_image = "Tour image is required.";
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
    if (!formData.category) {
      newErrors.category = "Category is required.";
      isValid = false;
    }
    if (Object.keys(formData.nights).length === 0) {
      newErrors.nights = "At least one night option is required.";
      isValid = false;
    }
    Object.entries(formData.nights).forEach(([nightsKey, options]) => {
      if (!options.standard.option || !options.premium.option) {
        newErrors[`nights_${nightsKey}`] = `Both standard and premium options for ${nightsKey} nights are required.`;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitTour = async () => {
    if (!validateForm()) {
      Swal.fire("Error", "Please fill out all required fields.", "error");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        price: parseInt(formData.price, 10) || 0,
        oldPrice: parseInt(formData.oldPrice, 10) || 0,
        person_count: parseInt(formData.person_count, 10) || 0,
        days: parseInt(formData.days, 10) || 0,
        expiry_date: formData.expiry_date,
        valid_from: formData.valid_from,
        valid_to: formData.valid_to,
        food_category: formData.food_category,
        nights: formData.nights,
        country: formData.country,
        markets: formData.markets,
        sum: formData.sum, // Added sum to payload
        tour_summary: formData.tour_summary,
        inclusions: formData.inclusions.split("\n").filter(Boolean),
        exclusions: formData.exclusions.split("\n").filter(Boolean),
        facilities: formData.facilities.split("\n").filter(Boolean),
        tour_image: formData.tour_image,
        destination_images: formData.destination_images,
        activity_images: formData.activity_images,
        hotel_images: formData.hotel_images,
        itinerary: formData.itinerary,
        itinerary_titles: formData.itinerary_titles,
        itinerary_images: formData.itinerary_images,
        category: formData.category,
      };

      const response = await axios.post("/api/tours", payload);
      Swal.fire("Success!", "Tour has been created successfully.", "success");
      handleReset();
    } catch (error) {
      console.error("Error creating tour:", error.response?.data || error);
      Swal.fire("Error", error.response?.data?.message || "Failed to create tour.", "error");
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      price: "",
      oldPrice: "",
      person_count: "",
      days: "",
      expiry_date: "",
      valid_from: "",
      valid_to: "",
      food_category: {
        0: [0, 0, false],
        1: [0, 0, false],
        2: [0, 0, false],
      },
      nights: {},
      country: "",
      markets: [],
      sum: "", // Reset sum
      tour_summary: "",
      inclusions: "",
      exclusions: "",
      facilities: "",
      tour_image: "",
      destination_images: [],
      activity_images: [],
      hotel_images: [],
      itinerary: { first_day: "", middle_days: {}, last_day: "" },
      itinerary_titles: { first_day: "", middle_days: {}, last_day: "" },
      itinerary_images: { first_day: [], middle_days: {}, last_day: [] },
      category: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Add New Tour</h2>
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tour Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tour title"
                  required
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Luxury, Adventure"
                  required
                />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                  required
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Old Price</label>
                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter old price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Person Count</label>
                <input
                  type="number"
                  name="person_count"
                  value={formData.person_count}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter person count"
                  required
                />
                {errors.person_count && <p className="text-red-500 text-sm mt-1">{errors.person_count}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Days</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number of days"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleConfirmDays}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
                {errors.days && <p className="text-red-500 text-sm mt-1">{errors.days}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter country"
                  required
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Validity Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.expiry_date && <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Valid From</label>
                <input
                  type="date"
                  name="valid_from"
                  value={formData.valid_from}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.valid_from && <p className="text-red-500 text-sm mt-1">{errors.valid_from}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Valid To</label>
                <input
                  type="date"
                  name="valid_to"
                  value={formData.valid_to}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.valid_to && <p className="text-red-500 text-sm mt-1">{errors.valid_to}</p>}
              </div>
            </div>
          </div>

          {/* Nights Options */}
          <div className="border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Nights Options</h3>
              <button
                type="button"
                onClick={handleAddNightOption}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <FaPlus size={12} /> Add Night Option
              </button>
            </div>
            {errors.nights && <p className="text-red-500 text-sm mb-4">{errors.nights}</p>}
            <div className="space-y-4">
              {Object.entries(formData.nights)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([nightsKey, options]) => (
                  <div key={nightsKey} className="border p-4 rounded-lg bg-gray-50 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveNightOption(nightsKey)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                    >
                      <FaTrash size={12} />
                    </button>
                    <h4 className="font-semibold text-gray-700 mb-2">{`${nightsKey} Nights`}</h4>
                    {errors[`nights_${nightsKey}`] && (
                      <p className="text-red-500 text-sm mb-2">{errors[`nights_${nightsKey}`]}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-600 mb-2">Standard</h5>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Option Name</label>
                          <input
                            type="text"
                            value={options.standard?.option || ""}
                            onChange={(e) => handleNightsChange(nightsKey, "standard", "option", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Standard Beach Villa"
                            required
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm text-gray-600 mb-1">Additional Price</label>
                          <input
                            type="number"
                            value={options.standard?.add_price || ""}
                            onChange={(e) => handleNightsChange(nightsKey, "standard", "add_price", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter additional price"
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm text-gray-600 mb-1">Old Additional Price</label>
                          <input
                            type="number"
                            value={options.standard?.old_add_price || ""}
                            onChange={(e) => handleNightsChange(nightsKey, "standard", "old_add_price", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter old additional price"
                          />
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-600 mb-2">Premium</h5>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Option Name</label>
                          <input
                            type="text"
                            value={options.premium?.option || ""}
                            onChange={(e) => handleNightsChange(nightsKey, "premium", "option", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Premium Overwater Villa"
                            required
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm text-gray-600 mb-1">Additional Price</label>
                          <input
                            type="number"
                            value={options.premium?.add_price || ""}
                            onChange={(e) => handleNightsChange(nightsKey, "premium", "add_price", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter additional price"
                          />
                        </div>
                        <div className="mt-2">
                          <label className="block text-sm text-gray-600 mb-1">Old Additional Price</label>
                          <input
                            type="number"
                            value={options.premium?.old_add_price || ""}
                            onChange={(e) => handleNightsChange(nightsKey, "premium", "old_add_price", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter old additional price"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Meal Category Pricing */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Meal Category Pricing</h3>
            <div className="space-y-4">
              {Object.entries(foodCategoryMapping).map(([key, label]) => (
                <div key={key} className="border p-4 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">{label}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Additional Price</label>
                      <input
                        type="number"
                        value={formData.food_category[key]?.[0] || ""}
                        onChange={(e) => handleFoodCategoryChange(key, 0, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter additional price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Old Additional Price</label>
                      <input
                        type="number"
                        value={formData.food_category[key]?.[1] || ""}
                        onChange={(e) => handleFoodCategoryChange(key, 1, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter old additional price"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        checked={!!formData.food_category[key]?.[2]}
                        onChange={(e) => handleFoodCategoryCheckboxChange(key, e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded"
                      />
                      <label className="text-sm text-gray-600">Tour Available</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Markets */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Markets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
              {Object.entries(marketMapping).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={key}
                    checked={formData.markets.includes(Number(key))}
                    onChange={handleMarketsChange}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label className="text-sm text-gray-600">{value}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Hero Tour Summary</h3>
            <input
              type="text"
              name="sum"
              value={formData.sum}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a short summary of the tour"
              required
            />
            {errors.sum && <p className="text-red-500 text-sm mt-1">{errors.sum}</p>}
          </div>

          {/* Tour Summary */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Tour Summary</h3>
            <textarea
              name="tour_summary"
              value={formData.tour_summary}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter detailed tour summary"
              required
            />
            {errors.tour_summary && <p className="text-red-500 text-sm mt-1">{errors.tour_summary}</p>}
          </div>

          {/* Images */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Images</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tour Image <span className="text-gray-400 text-xs">(Size 1×1)</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, "tour_image", "tour_image")}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {formData.tour_image && (
                  <div className="relative mt-4">
                    <img
                      src={formData.tour_image}
                      alt="Tour Image"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("tour_image", 0, "tour_image")}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                )}
                {errors.tour_image && <p className="text-red-500 text-sm mt-1">{errors.tour_image}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Destination Images <span className="text-gray-400 text-xs">(Size 3×2)</span>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "destination_images", "destination_images")}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex flex-wrap gap-4 mt-4">
                  {formData.destination_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Destination Image ${index}`}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("destination_images", index, "destination_images")}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Activity Images <span className="text-gray-400 text-xs">(Size 3×2)</span>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "activity_images", "activity_images")}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex flex-wrap gap-4 mt-4">
                  {formData.activity_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Activity Image ${index}`}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("activity_images", index, "activity_images")}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Hotel Images <span className="text-gray-400 text-xs">(Size 3×2)</span>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "hotel_images", "hotel_images")}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex flex-wrap gap-4 mt-4">
                  {formData.hotel_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Hotel Image ${index}`}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("hotel_images", index, "hotel_images")}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Itinerary</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-700 mb-3">Arrival Day</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.itinerary_titles.first_day}
                    onChange={(e) => handleItineraryTitleChange(e, "first_day")}
                    placeholder="Title for Arrival Day"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Activities</label>
                  <textarea
                    rows="3"
                    placeholder="Activities for Arrival Day"
                    value={formData.itinerary.first_day}
                    onChange={(e) => handleItineraryChange(e, "first_day")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.first_day && <p className="text-red-500 text-sm mt-1">{errors.first_day}</p>}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Images <span className="text-gray-400 text-xs">(Size 3×2)</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, "first_day", "first_day")}
                    multiple
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <div className="flex flex-wrap gap-4 mt-4">
                    {formData.itinerary_images.first_day.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Arrival Day Image ${index}`}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("first_day", index, "first_day")}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {Object.keys(formData.itinerary.middle_days)
                .sort((a, b) => parseInt(a.split("_")[1], 10) - parseInt(b.split("_")[1], 10))
                .map((dayKey) => (
                  <div key={dayKey} className="p-4 rounded-lg bg-blue-50">
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">{`Day ${dayKey.split("_")[1]}`}</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.itinerary_titles.middle_days[dayKey]}
                        onChange={(e) => handleItineraryTitleChange(e, "middle_days", dayKey)}
                        placeholder={`Title for Day ${dayKey.split("_")[1]}`}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Activities</label>
                      <textarea
                        rows="3"
                        placeholder={`Activities for Day ${dayKey.split("_")[1]}`}
                        value={formData.itinerary.middle_days[dayKey]}
                        onChange={(e) => handleItineraryChange(e, "middle_days", dayKey)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {errors[dayKey] && <p className="text-red-500 text-sm mt-1">{errors[dayKey]}</p>}
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Images <span className="text-gray-400 text-xs">(Size 3×2)</span>
                      </label>
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, dayKey, "middle_days")}
                        multiple
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <div className="flex flex-wrap gap-4 mt-4">
                        {formData.itinerary_images.middle_days[dayKey]?.map((image, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={image}
                              alt={`Day ${dayKey.split("_")[1]} Image ${idx}`}
                              className="w-32 h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(dayKey, idx, "middle_days")}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-700 mb-3">Departure Day</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.itinerary_titles.last_day}
                    onChange={(e) => handleItineraryTitleChange(e, "last_day")}
                    placeholder="Title for Departure Day"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Activities</label>
                  <textarea
                    rows="3"
                    placeholder="Activities for Departure Day"
                    value={formData.itinerary.last_day}
                    onChange={(e) => handleItineraryChange(e, "last_day")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.last_day && <p className="text-red-500 text-sm mt-1">{errors.last_day}</p>}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Images <span className="text-gray-400 text-xs">(Size 3×2)</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, "last_day", "last_day")}
                    multiple
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <div className="flex flex-wrap gap-4 mt-4">
                    {formData.itinerary_images.last_day.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Departure Day Image ${index}`}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("last_day", index, "last_day")}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inclusions and Exclusions */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Inclusions & Exclusions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Inclusions</label>
                <textarea
                  name="inclusions"
                  value={formData.inclusions}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="List inclusions, one per line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Exclusions</label>
                <textarea
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="List exclusions, one per line"
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Facilities</h3>
            <textarea
              name="facilities"
              value={formData.facilities}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="List facilities, one per line"
            />
          </div>

          {/* Submit/Reset Buttons */}
          <div className="sticky bottom-0 bg-white py-4 px-8 flex justify-center gap-4 border-t">
            <button
              type="button"
              onClick={handleSubmitTour}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow"
            >
              Submit Tour
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 shadow"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourForm;