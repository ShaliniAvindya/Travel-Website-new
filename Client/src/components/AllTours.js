import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const marketMapping = {
  1: "Indian Market",
  2: "Chinese Market",
  3: "Asian Markets",
  4: "Middle East Markets",
  5: "Russia and CIS Markets",
  6: "All Markets",
};

// Each key in foodCategoryMapping is 0,1,2 for your DB structure
const foodCategoryMapping = {
  0: "Half Board",
  1: "Full Board",
  2: "All Inclusive",
};

const AllTours = () => {
  const [tours, setTours] = useState([]);
  const [editTour, setEditTour] = useState(null);

  // Local state for editing a single tour
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    // 'nightsOptions' is the entire 'nights' object from DB
    nightsOptions: {},
    expiry_date: "",
    valid_from: "",
    valid_to: "",
    /*
      For each key (0,1,2) in food_category, store an array [ addPrice, oldAddPrice ].
      Example: food_category[0] = [200, 250].
    */
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
  });

  // For adding new nights options to an existing nightsKey
  // e.g. newNightsOptions["4"] = { option: "...", add_price: "...", old_add_price: "..." }
  const [newNightsOptions, setNewNightsOptions] = useState({});

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("/tours");
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };
    fetchTours();
  }, []);

  // Helper to format dates (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Open edit modal and load tour data into formData
  const handleEditOpen = (tour) => {
    setEditTour(tour);

    // Convert arrays -> \n for inclusions, exclusions, facilities
    const inclusionsString = Array.isArray(tour.inclusions)
      ? tour.inclusions.join("\n")
      : "";
    const exclusionsString = Array.isArray(tour.exclusions)
      ? tour.exclusions.join("\n")
      : "";
    const facilitiesString = Array.isArray(tour.facilities)
      ? tour.facilities.join("\n")
      : "";

    // If there's no food_category, default to arrays [0,0]
    const loadedFoodCategory = tour.food_category || {
      0: [0, 0],
      1: [0, 0],
      2: [0, 0],
    };

    setFormData({
      title: tour.title,
      price: tour.price,
      nightsOptions: tour.nights || {},
      expiry_date: formatDate(tour.expiry_date),
      valid_from: formatDate(tour.valid_from),
      valid_to: formatDate(tour.valid_to),
      // Ensure each catKey is an array of length 2
      food_category: {
        0: Array.isArray(loadedFoodCategory[0])
          ? loadedFoodCategory[0]
          : [0, 0],
        1: Array.isArray(loadedFoodCategory[1])
          ? loadedFoodCategory[1]
          : [0, 0],
        2: Array.isArray(loadedFoodCategory[2])
          ? loadedFoodCategory[2]
          : [0, 0],
      },
      country: tour.country,
      markets: tour.markets || [],
      tour_summary: tour.tour_summary || "",
      oldPrice: tour.oldPrice || "",
      inclusions: inclusionsString,
      exclusions: exclusionsString,
      facilities: facilitiesString,
      tour_image: Array.isArray(tour.tour_image) ? tour.tour_image : [tour.tour_image],
      destination_images: tour.destination_images || [],
      activity_images: tour.activity_images || [],
      hotel_images: tour.hotel_images || [],
      itinerary: tour.itinerary || {
        first_day: "",
        middle_days: {},
        last_day: "",
      },
      itineraryImages: tour.itinerary_images || {
        first_day: [],
        middle_days: {},
        last_day: [],
      },
      itineraryTitles: tour.itinerary_titles || {
        first_day: "",
        middle_days: {},
        last_day: "",
      },
    });

    // Clear leftover data for adding new options
    setNewNightsOptions({});
  };

  const handleEditClose = () => {
    setEditTour(null);
    setFormData({
      title: "",
      price: "",
      nightsOptions: {},
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
      itinerary: { first_day: "", middle_days: {}, last_day: "" },
      itineraryImages: { first_day: [], middle_days: {}, last_day: [] },
      itineraryTitles: { first_day: "", middle_days: {}, last_day: "" },
    });
    setNewNightsOptions({});
  };

  // ============ General Handlers =============

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For markets (checkbox array)
  const handleMarketsChange = (e) => {
    const { checked, value } = e.target;
    const numericValue = Number(value);
    setFormData((prevData) => ({
      ...prevData,
      markets: checked
        ? [...prevData.markets, numericValue]
        : prevData.markets.filter((m) => m !== numericValue),
    }));
  };

  // ============ Food Category Pricing (2-value arrays) =============
  // catKey => 0,1,2 ; index => 0 or 1 ; e.g. formData.food_category[0] = [200,250]
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

  // ============ Nights Options Editing =============
  const removeNightsOption = (nightsKey, index) => {
    setFormData((prev) => ({
      ...prev,
      nightsOptions: {
        ...prev.nightsOptions,
        [nightsKey]: Array.isArray(prev.nightsOptions[nightsKey])
          ? prev.nightsOptions[nightsKey].filter((_, i) => i !== index)
          : [],
      },
    }));
  };

  // Adds a new option to an existing nightsKey
  const addNightsOption = (nightsKey) => {
    const newOption = newNightsOptions[nightsKey];
    if (!newOption || !newOption.option || !newOption.add_price || !newOption.old_add_price) {
      Swal.fire("Error", "Please fill in all fields for the nights option.", "error");
      return;
    }

    setFormData((prev) => {
      const existingOptions = prev.nightsOptions[nightsKey];
      const currentArr = Array.isArray(existingOptions)
        ? existingOptions
        : Object.values(existingOptions || {});
      return {
        ...prev,
        nightsOptions: {
          ...prev.nightsOptions,
          [nightsKey]: [...currentArr, newOption],
        },
      };
    });

    // Clear local state for that nightsKey
    setNewNightsOptions((prev) => ({
      ...prev,
      [nightsKey]: { option: "", add_price: "", old_add_price: "" },
    }));
  };

  // ============ Itinerary Handlers =============
  const handleItineraryChange = (e, section, dayKey = null) => {
    const value = e.target.value;
    if (section === "middle_days" && dayKey) {
      setFormData((prev) => ({
        ...prev,
        itinerary: {
          ...prev.itinerary,
          middle_days: {
            ...prev.itinerary.middle_days,
            [dayKey]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        itinerary: {
          ...prev.itinerary,
          [section]: value,
        },
      }));
    }
  };

  const handleItineraryTitleChange = (e, section, dayKey = null) => {
    const value = e.target.value;
    if (section === "middle_days" && dayKey) {
      setFormData((prev) => ({
        ...prev,
        itineraryTitles: {
          ...prev.itineraryTitles,
          middle_days: {
            ...prev.itineraryTitles.middle_days,
            [dayKey]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        itineraryTitles: {
          ...prev.itineraryTitles,
          [section]: value,
        },
      }));
    }
  };

  // ============ Image Upload & Remove ============
  const handleImageUpload = async (e, key, section) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const previewUrl = URL.createObjectURL(file);

      if (section === "middle_days" && key) {
        // Middle days images
        setFormData((prev) => ({
          ...prev,
          itineraryImages: {
            ...prev.itineraryImages,
            middle_days: {
              ...prev.itineraryImages.middle_days,
              [key]: [...(prev.itineraryImages.middle_days[key] || []), previewUrl],
            },
          },
        }));
      } else if (
        section === "tour" ||
        section === "destination_images" ||
        section === "activity_images" ||
        section === "hotel_images"
      ) {
        // Generic top-level images
        setFormData((prev) => ({
          ...prev,
          [section]: [...prev[section], previewUrl],
        }));
      } else {
        // first_day / last_day images
        setFormData((prev) => ({
          ...prev,
          itineraryImages: {
            ...prev.itineraryImages,
            [key]: [...prev.itineraryImages[key], previewUrl],
          },
        }));
      }

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("image", file);
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39",
          {
            method: "POST",
            body: formDataToSend,
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }
        const data = await response.json();
        const finalUrl = data.data.url;

        // Replace preview with final URL
        if (section === "middle_days" && key) {
          setFormData((prev) => ({
            ...prev,
            itineraryImages: {
              ...prev.itineraryImages,
              middle_days: {
                ...prev.itineraryImages.middle_days,
                [key]: prev.itineraryImages.middle_days[key].map((url) =>
                  url === previewUrl ? finalUrl : url
                ),
              },
            },
          }));
        } else if (
          section === "tour" ||
          section === "destination_images" ||
          section === "activity_images" ||
          section === "hotel_images"
        ) {
          setFormData((prev) => ({
            ...prev,
            [section]: prev[section].map((url) => (url === previewUrl ? finalUrl : url)),
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            itineraryImages: {
              ...prev.itineraryImages,
              [key]: prev.itineraryImages[key].map((url) =>
                url === previewUrl ? finalUrl : url
              ),
            },
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleRemoveImage = (key, index, section) => {
    if (section === "middle_days" && key) {
      setFormData((prev) => ({
        ...prev,
        itineraryImages: {
          ...prev.itineraryImages,
          middle_days: {
            ...prev.itineraryImages.middle_days,
            [key]: prev.itineraryImages.middle_days[key].filter((_, i) => i !== index),
          },
        },
      }));
    } else if (
      section === "tour" ||
      section === "destination_images" ||
      section === "activity_images" ||
      section === "hotel_images"
    ) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      }));
    } else {
      // first_day / last_day
      setFormData((prev) => ({
        ...prev,
        itineraryImages: {
          ...prev.itineraryImages,
          [key]: prev.itineraryImages[key].filter((_, i) => i !== index),
        },
      }));
    }
  };

  // ============ Save / Delete =============
  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        price: formData.price,
        nights: formData.nightsOptions,
        expiry_date: formData.expiry_date,
        valid_from: formData.valid_from,
        valid_to: formData.valid_to,
        // Each catKey => [ add_price, old_add_price ]
        food_category: formData.food_category,
        country: formData.country,
        markets: formData.markets,
        tour_summary: formData.tour_summary,
        tour_image: formData.tour_image[0] || "",
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

      const response = await axios.put(`/tours/${editTour._id}`, payload);
      if (response.status === 200) {
        Swal.fire("Success!", "Tour has been updated successfully.", "success");
        setTours((prevTours) =>
          prevTours.map((t) => (t._id === editTour._id ? response.data : t))
        );
        setEditTour(null);
      } else {
        throw new Error("Failed to update the tour.");
      }
    } catch (error) {
      console.error("Error updating tour:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`/tours/${id}`);
        if (response.status === 200) {
          setTours(tours.filter((tour) => tour._id !== id));
          Swal.fire("Deleted!", "Tour has been deleted.", "success");
        } else {
          throw new Error("Failed to delete the tour.");
        }
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="bg-white min-h-screen p-0">
      <h1 className="text-5xl font-bold text-center mb-8">All Tours (Admin Panel)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div
            key={tour._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105"
          >
            <img
              src={tour.tour_image}
              alt={tour.title}
              className="h-72 w-full object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold">{tour.title}</h3>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 min-w-48 rounded hover:bg-blue-600"
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

      {/* EDIT MODAL */}
      {editTour && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="relative w-full max-w-4xl bg-white rounded-lg p-8 shadow-xl transform transition-all scale-100 mt-20">
            <button
              onClick={handleEditClose}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
              Edit Tour Details
            </h2>

            <div className="overflow-y-auto max-h-[70vh] space-y-6 pr-2">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Tour Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Valid From */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Valid From</label>
                <input
                  type="date"
                  name="valid_from"
                  value={formData.valid_from}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Valid To */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Valid To</label>
                <input
                  type="date"
                  name="valid_to"
                  value={formData.valid_to}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Food Category Pricing (arrays of [addPrice, oldAddPrice]) */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Meal Category Pricing
                </label>
                {Object.entries(foodCategoryMapping).map(([key, label]) => (
                  <div key={key} className="border p-4 rounded-md my-2">
                    <h4 className="font-bold">{label}</h4>
                    <div className="flex space-x-4 mt-2">
                      <div>
                        <label className="block text-sm text-gray-500">Additional Price</label>
                        <input
                          type="number"
                          value={formData.food_category[key]?.[0] || ""}
                          onChange={(e) =>
                            handleFoodCategoryChange(key, 0, e.target.value)
                          }
                          className="p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Old Additional Price</label>
                        <input
                          type="number"
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
                <label className="block text-sm font-medium text-gray-600">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Markets */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Markets</label>
                <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                  {Object.entries(marketMapping).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        value={key}
                        checked={formData.markets.includes(Number(key))}
                        onChange={handleMarketsChange}
                      />
                      <label>{value}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tour Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Tour Summary</label>
                <textarea
                  name="tour_summary"
                  value={formData.tour_summary}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Tour summary"
                />
              </div>

              {/* Tour Image */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Tour Image</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "tour_image", "tour")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
                        onClick={() => handleRemoveImage("tour_image", index, "tour")}
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
                <label className="block text-sm font-medium text-gray-600">
                  Destination Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleImageUpload(e, "destination_images", "destination_images")
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-4">
                  {formData.destination_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Destination Image ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveImage("destination_images", index, "destination_images")
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
                <label className="block text-sm font-medium text-gray-600">Activity Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "activity_images", "activity_images")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-4">
                  {formData.activity_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Activity Image ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("activity_images", index, "activity_images")}
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
                <label className="block text-sm font-medium text-gray-600">Hotel Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageUpload(e, "hotel_images", "hotel_images")}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-4">
                  {formData.hotel_images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Hotel Image ${index}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("hotel_images", index, "hotel_images")}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nights Options (Add-on Pricing) - Existing Keys */}
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="text-xl font-bold mb-4">Nights Options (Add-on Pricing)</h3>
                {Object.entries(formData.nightsOptions).map(([nightsKey, optionsArray]) => {
                  // If optionsArray is an array, use it; if it’s an object, use its values.
                  const safeArray = Array.isArray(optionsArray) ? optionsArray : Object.values(optionsArray);
                  return (
                    <div key={nightsKey} className="mb-4 border-b pb-4">
                      <h4 className="font-semibold mb-2">{nightsKey} nights</h4>
                      {safeArray.map((opt, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 border-b">
                          <p>
                            {opt.option} 
                            <br />
                            <span className="text-gray-500">Additional Price: <span className="bg-gray-300/80 text-gray-600 p-1"> {opt.add_price} </span>, Old Additional Price:<span className="bg-gray-300/80 text-gray-600 p-1"> {opt.old_add_price}</span></span>
                          </p>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => removeNightsOption(nightsKey, idx)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}

                      {/* Add new option to this nightsKey */}
                      <div className="flex flex-wrap items-center space-x-2 mt-3">
                        <input
                          type="text"
                          placeholder="Option description"
                          value={newNightsOptions[nightsKey]?.option || ""}
                          onChange={(e) =>
                            setNewNightsOptions((prev) => ({
                              ...prev,
                              [nightsKey]: {
                                ...prev[nightsKey],
                                option: e.target.value,
                              },
                            }))
                          }
                          className="p-2 border border-gray-300 rounded w-1/3"
                        />
                        <input
                          type="number"
                          placeholder="Add Price"
                          value={newNightsOptions[nightsKey]?.add_price || ""}
                          onChange={(e) =>
                            setNewNightsOptions((prev) => ({
                              ...prev,
                              [nightsKey]: {
                                ...prev[nightsKey],
                                add_price: e.target.value,
                              },
                            }))
                          }
                          className="p-2 border border-gray-300 rounded w-1/4"
                        />
                        <input
                          type="number"
                          placeholder="Old Add Price"
                          value={newNightsOptions[nightsKey]?.old_add_price || ""}
                          onChange={(e) =>
                            setNewNightsOptions((prev) => ({
                              ...prev,
                              [nightsKey]: {
                                ...prev[nightsKey],
                                old_add_price: e.target.value,
                              },
                            }))
                          }
                          className="p-2 border border-gray-300 rounded w-1/4"
                        />
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                          onClick={() => addNightsOption(nightsKey)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Facilities</label>
                <textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter facilities, one per line"
                />
              </div>

              {/* Itinerary */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Itinerary</label>
                <div className="space-y-6">
                  {/* Arrival Day */}
                  <div className="border p-4 rounded-md bg-blue-100">
                    <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                      Arrival Day
                    </span>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mt-3">Title</label>
                      <input
                        type="text"
                        value={formData.itineraryTitles.first_day}
                        onChange={(e) => handleItineraryTitleChange(e, "first_day")}
                        placeholder="Title for Arrival Day"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mt-1">Activities</label>
                      <textarea
                        rows="2"
                        placeholder="Activities for Arrival Day"
                        value={formData.itinerary.first_day}
                        onChange={(e) => handleItineraryChange(e, "first_day")}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mt-1">Images</label>
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, "first_day", "first_day")}
                        multiple
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                      <div className="flex space-x-2 mt-4">
                        {formData.itineraryImages.first_day.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Arrival Day ${index}`}
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
                  {Object.keys(formData.itinerary.middle_days).length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold">Middle Days</h3>
                      {Object.keys(formData.itinerary.middle_days).map((dayKey) => (
                        <div key={dayKey} className="border p-4 rounded-md bg-blue-100 my-4">
                          <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                            {`Day ${dayKey.split("_")[1]}`}
                          </span>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mt-3">
                              Title
                            </label>
                            <input
                              type="text"
                              value={formData.itineraryTitles.middle_days[dayKey]}
                              onChange={(e) =>
                                handleItineraryTitleChange(e, "middle_days", dayKey)
                              }
                              placeholder={`Title for Day ${dayKey.split("_")[1]}`}
                              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mt-1">
                              Activities
                            </label>
                            <textarea
                              rows="2"
                              placeholder={`Activities for Day ${dayKey.split("_")[1]}`}
                              value={formData.itinerary.middle_days[dayKey]}
                              onChange={(e) =>
                                handleItineraryChange(e, "middle_days", dayKey)
                              }
                              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mt-1">
                              Images
                            </label>
                            <input
                              type="file"
                              onChange={(e) => handleImageUpload(e, dayKey, "middle_days")}
                              multiple
                              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
                    </div>
                  )}

                  {/* Departure Day */}
                  <div className="border p-4 rounded-md bg-blue-100">
                    <span className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                      Departure Day
                    </span>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mt-3">Title</label>
                      <input
                        type="text"
                        value={formData.itineraryTitles.last_day}
                        onChange={(e) => handleItineraryTitleChange(e, "last_day")}
                        placeholder="Title for Departure Day"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mt-1">
                        Activities
                      </label>
                      <textarea
                        rows="2"
                        placeholder="Activities for Departure Day"
                        value={formData.itinerary.last_day}
                        onChange={(e) => handleItineraryChange(e, "last_day")}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mt-1">Images</label>
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, "last_day", "last_day")}
                        multiple
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                      <div className="flex space-x-2 mt-4">
                        {formData.itineraryImages.last_day.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Departure Day ${index}`}
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
              </div>

              {/* Inclusions */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Inclusions</label>
                <textarea
                  name="inclusions"
                  value={formData.inclusions}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="List of inclusions (ENTER for each item)"
                />
              </div>

              {/* Exclusions */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Exclusions</label>
                <textarea
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="List of exclusions (ENTER for each item)"
                />
              </div>

              {/* Old Price */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Old Price</label>
                <input
                  type="text"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* Save Button */}
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
