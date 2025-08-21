import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash, FaEdit, FaCopy, FaPlus } from "react-icons/fa";

const marketMapping = {
  1: "Indian Market",
  2: "Chinese Market",
  3: "Asian Markets",
  4: "Middle East Markets",
  5: "Russia and CIS Markets",
  6: "All Markets",
};

const foodCategoryMapping = {
  0: "Half Board",
  1: "Full Board",
  2: "All Inclusive",
};

const AllTours = () => {
  const [tours, setTours] = useState([]);
  const [editTour, setEditTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

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
    tour_summary: "",
    sum: "",
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

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/tours");
        setTours(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setError("Failed to load tours. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleEditOpen = (tour) => {
    setEditTour(tour);
    setFormData({
      title: tour.title || "",
      price: tour.price || "",
      oldPrice: tour.oldPrice || "",
      person_count: tour.person_count || "",
      days: tour.days || "",
      expiry_date: formatDate(tour.expiry_date),
      valid_from: formatDate(tour.valid_from),
      valid_to: formatDate(tour.valid_to),
      food_category: tour.food_category || {
        0: [0, 0, false],
        1: [0, 0, false],
        2: [0, 0, false],
      },
      nights: tour.nights || {},
      country: tour.country || "",
      markets: tour.markets || [],
      tour_summary: tour.tour_summary || "",
      sum: tour.sum || "",
      inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join("\n") : "",
      exclusions: Array.isArray(tour.exclusions) ? tour.exclusions.join("\n") : "",
      facilities: Array.isArray(tour.facilities) ? tour.facilities.join("\n") : "",
      tour_image: tour.tour_image || "",
      destination_images: tour.destination_images || [],
      activity_images: tour.activity_images || [],
      hotel_images: tour.hotel_images || [],
      itinerary: tour.itinerary || { first_day: "", middle_days: {}, last_day: "" },
      itinerary_titles: tour.itinerary_titles || {
        first_day: "",
        middle_days: {},
        last_day: "",
      },
      itinerary_images: tour.itinerary_images || {
        first_day: [],
        middle_days: {},
        last_day: [],
      },
      category: tour.category || "",
    });
  };

  const handleEditClose = () => {
    setEditTour(null);
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
      tour_summary: "",
      sum: "",
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
            ...prev.nights[nightsKey][type],
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
    if (!formData.tour_summary) {
      newErrors.tour_summary = "Tour summary is required.";
      isValid = false;
    }
    if (!formData.sum) {
      newErrors.sum = "Summary is required.";
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

  const handleSave = async () => {
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
        tour_summary: formData.tour_summary,
        sum: formData.sum,
        tour_image: formData.tour_image,
        destination_images: formData.destination_images,
        activity_images: formData.activity_images,
        hotel_images: formData.hotel_images,
        inclusions: formData.inclusions.split("\n").filter(Boolean),
        exclusions: formData.exclusions.split("\n").filter(Boolean),
        facilities: formData.facilities.split("\n").filter(Boolean),
        itinerary: formData.itinerary,
        itinerary_titles: formData.itinerary_titles,
        itinerary_images: formData.itinerary_images,
        category: formData.category,
      };

      const response = await axios.put(`/api/tours/${editTour._id}`, payload);
      setTours((prevTours) =>
        prevTours.map((t) => (t._id === editTour._id ? response.data : t))
      );
      Swal.fire("Success!", "Tour updated successfully.", "success");
      handleEditClose();
    } catch (error) {
      console.error("Error updating tour:", error.response?.data || error);
      Swal.fire("Error", error.response?.data?.message || "Failed to update tour.", "error");
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
        await axios.delete(`/api/tours/${id}`);
        setTours(tours.filter((tour) => tour._id !== id));
        Swal.fire("Deleted!", "Tour has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting tour:", error.response?.data || error);
      Swal.fire("Error", error.response?.data?.message || "Failed to delete tour.", "error");
    }
  };

  const handleDuplicate = async (tour) => {
    try {
      const { _id, createdAt, updatedAt, __v, ...duplicateData } = tour;
      const response = await axios.post("/api/tours", duplicateData);
      setTours([...tours, response.data]);
      Swal.fire("Success!", "Tour duplicated successfully.", "success");
    } catch (error) {
      console.error("Error duplicating tour:", error.response?.data || error);
      Swal.fire("Error", error.response?.data?.message || "Failed to duplicate tour.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">All Tours (Admin Panel)</h1>
      {loading ? (
        <div className="text-center text-gray-600">Loading tours...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : tours.length === 0 ? (
        <div className="text-center text-gray-500">No tours available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tours.map((tour) => (
            <div
              key={tour._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={tour.tour_image || "https://via.placeholder.com/400x200"}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                {tour.oldPrice > 0 && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Sale
                  </span>
                )}
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {tour.category || "N/A"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 truncate">{tour.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{tour.sum || "No summary available"}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">${tour.price}</span>
                    {tour.oldPrice > 0 && (
                      <span className="text-gray-500 line-through text-sm">${tour.oldPrice}</span>
                    )}
                  </div>
                  <span className="text-gray-600 text-sm">{tour.person_count} Persons</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 text-sm">{tour.days} Days</span>
                  <span className="text-gray-600 text-sm">{tour.country || "N/A"}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2"
                    onClick={() => handleEditOpen(tour)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2"
                    onClick={() => handleDuplicate(tour)}
                  >
                    <FaCopy /> Duplicate
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-2"
                    onClick={() => handleDelete(tour._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editTour && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="flex-1 overflow-y-auto p-8">
              <button
                onClick={handleEditClose}
                className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Tour</h2>
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

                {/* Summary */}
                <div className="border-b pb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Hero Tour Summary</h3>
                  <textarea
                    name="sum"
                    value={formData.sum}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter brief tour summary"
                    required
                  />
                  {errors.sum && <p className="text-red-500 text-sm mt-1">{errors.sum}</p>}
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
                                  value={options.standard.option}
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
                                  value={options.standard.add_price}
                                  onChange={(e) => handleNightsChange(nightsKey, "standard", "add_price", e.target.value)}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter additional price"
                                />
                              </div>
                              <div className="mt-2">
                                <label className="block text-sm text-gray-600 mb-1">Old Additional Price</label>
                                <input
                                  type="number"
                                  value={options.standard.old_add_price}
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
                                  value={options.premium.option}
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
                                  value={options.premium.add_price}
                                  onChange={(e) => handleNightsChange(nightsKey, "premium", "add_price", e.target.value)}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter additional price"
                                />
                              </div>
                              <div className="mt-2">
                                <label className="block text-sm text-gray-600 mb-1">Old Additional Price</label>
                                <input
                                  type="number"
                                  value={options.premium.old_add_price}
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

                {/* Tour Summary */}
                <div className="border-b pb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Tour Summary</h3>
                  <textarea
                    name="tour_summary"
                    value={formData.tour_summary}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Enter tour summary"
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
                    {Object.keys(formData.itinerary.middle_days || {})
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
              </div>
            </div>
            {/* Save/Cancel Sticky Footer */}
            <div className="sticky bottom-0 bg-white py-4 px-8 flex justify-center gap-4 border-t">
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleEditClose}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTours;
