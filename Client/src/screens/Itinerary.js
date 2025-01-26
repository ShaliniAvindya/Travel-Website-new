import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Box } from "@mui/material";
import { PhoneInTalk as PhoneInTalkIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

const convertCurrency = (amount, currency) => {
  const exchangeRates = {
    USD: 1,
    LKR: 200,
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110,
  };
  const rate = exchangeRates[currency] || 1;
  return (amount * rate).toFixed(2);
};

const Itinerary = () => {
  const { id } = useParams();
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [imageIndices, setImageIndices] = useState([]);
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';


  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/tours/${id}`);
        setTourData(response.data);

        // Initialize image indices for all days
        const initialIndices = Array(response.data.nights + 1).fill(0);
        setImageIndices(initialIndices);
      } catch (err) {
        console.error("Error fetching tour data:", err);
        setError("Failed to fetch tour details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  useEffect(() => {
    if (!tourData || !tourData.itinerary_images) return;

    // Single interval for all sliders
    const interval = setInterval(() => {
      setImageIndices((prevIndices) => {
        return prevIndices.map((currentIndex, dayIndex) => {
          const imagesForDay = tourData.itinerary_images[`day_${dayIndex + 1}`];
          if (imagesForDay && imagesForDay.length > 0) {
            return (currentIndex + 1) % imagesForDay.length; // Cycle to the next image
          }
          return currentIndex; 
        });
      });
    }, 3000); 

    return () => clearInterval(interval);
  }, [tourData]);

  if (loading) {
    return <div>Loading tour details...</div>;
  }

  if (error || !tourData) {
    return <div>{error || "Tour not found."}</div>;
  }

  const totalDays = tourData.nights + 1;
  const handleInquiryClick = () => {
    window.location.href = "tel:+1234567890"; 
  };
  
  return (
    <div className="itinerary-wrap flex flex-col w-full">
      <div className="tabs flex justify-between mb-6 gap-4 w-full">
        {["itinerary", "summary", "fineprint"].map((tab) => (
          <div
            key={tab}
            className={`tab flex items-center justify-center px-8 py-4 cursor-pointer text-xl font-semibold transition-all duration-300 transform flex-1 border-2 rounded-lg ${
              activeTab === tab
                ? "bg-blue-600 text-white scale-105 shadow-lg border-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 border-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <div className="tab-content p-6">
        {activeTab === "itinerary" && (
          <div>
            {Array.from({ length: totalDays }).map((_, dayIndex) => {
              const dayDetails = tourData.itinerary ? tourData.itinerary[`day_${dayIndex + 1}`] : [];
              const imagesForDay = tourData.itinerary_images ? tourData.itinerary_images[`day_${dayIndex + 1}`] : [];
              const titleForDay = tourData.itinerary_titles ? tourData.itinerary_titles[`day_${dayIndex + 1}`] : `Day ${dayIndex + 1}`;

              return (
                <div
                  key={dayIndex}
                  className="itinerary-item flex flex-wrap border border-gray-300 p-6 mb-6 bg-white shadow-lg transform hover:scale-105 transition-all"
                >
                  <div className="itinerary-desc-wrap flex flex-col gap-6 flex-1">
                    <div className="flex items-center">
                      <div className="itinerary-day-box px-4 py-2 w-40 bg-blue-600 text-white font-semibold text-2xl">
                        Day {dayIndex + 1}
                      </div>
                      <div className="itinerary-title bg-gray-200 px-6 py-2 w-[80%] text-2xl font-semibold text-blue-800">
                        {titleForDay || `Day ${dayIndex + 1} - Title Not Available`}
                      </div>
                    </div>
                    <div className="itinerary-desc text-base leading-relaxed text-gray-700">
                      {dayDetails ? (
                        <ul className="list-disc pl-6">
                          {dayDetails.map((detail, index) => (
                            <li key={index} className="mb-2">{detail}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No activities available for this day.</p>
                      )}
                    </div>
                  </div>
                  <div className="itinerary-images relative flex items-center justify-center w-64 h-60 rounded-xl overflow-hidden">
                    {imagesForDay && imagesForDay.length > 0 ? (
                      <>
                        <img
                          src={imagesForDay[imageIndices[dayIndex]]}
                          alt={`Day ${dayIndex + 1} image`}
                          className="w-full h-full object-cover rounded-xl transition-all duration-1000 ease-in-out"
                        />
                        <div
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl font-bold cursor-pointer z-10 select-none text-white"
                          onClick={() =>
                            setImageIndices((prevIndices) => {
                              const newIndices = [...prevIndices];
                              newIndices[dayIndex] =
                                (newIndices[dayIndex] - 1 + imagesForDay.length) %
                                imagesForDay.length; // Cycle backward
                              return newIndices;
                            })
                          }
                        >
                          &lt;
                        </div>
                        <div
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl font-bold cursor-pointer z-10 select-none text-white"
                          onClick={() =>
                            setImageIndices((prevIndices) => {
                              const newIndices = [...prevIndices];
                              newIndices[dayIndex] =
                                (newIndices[dayIndex] + 1) % imagesForDay.length; // Cycle forward
                              return newIndices;
                            })
                          }
                        >
                          &gt;
                        </div>
                      </>
                    ) : (
                      <p>No images available for this day.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {activeTab === "summary" && (
          <div className="summary-container">
            <div className="summary-item flex flex-wrap border border-gray-300 p-6 mb-6 bg-white shadow-lg transform hover:scale-105 transition-all">
              <div className="summary-desc-wrap flex flex-col gap-6 flex-1">
                <div className="summary-desc text-lg text-gray-700 leading-relaxed">
                  {tourData.tour_summary || "No summary available."}
                </div>
              </div>
              {tourData.tour_image && (
                <div className="summary-item-img flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden">
                  <img
                    src={tourData.tour_image}
                    alt="Tour Summary Image"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "fineprint" && (
          <div className="overflow-x-auto bg-white p-8">
            <Box className="justify-center space-x-4 items-center">
              <Box className="inline-block bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-3 px-8 mb-12 ml-4 shadow-xl">
              <Typography variant="h6" component="h2">
        Price: {selectedCurrency} {Number(convertCurrency(tourData.price, selectedCurrency)).toLocaleString()}
      </Typography>
              </Box>
              <Button
                sx={{
                  background: "linear-gradient(to right, #1e3a8a, #4f46e5)",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                  fontFamily: "Domine",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    background: "linear-gradient(to right, #1e40af, #3730a3)",
                  },
                }}
                onClick={handleInquiryClick}
              >
                <PhoneInTalkIcon sx={{ marginRight: "10px", fontSize: "inherit" }} />
                Inquiry Now
                <ArrowForwardIcon sx={{ marginLeft: "10px", fontSize: "inherit" }} />
              </Button>
            </Box>
            <h2 className="text-4xl font-semibold mb-6 text-center text-blue-900">What's Inside the Package?</h2>
            <table className="min-w-full table-auto border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-8 py-6 text-center text-xl font-medium text-gray-600 border-r">Inclusions</th>
                  <th className="px-8 py-6 text-center text-xl font-medium text-gray-600">Exclusions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="min-h-[200px]">
                  <td className="px-8 py-6 border-b border-r">
                    {Array.isArray(tourData.inclusions) && tourData.inclusions.length > 0 ? (
                      <ul className="list-none gap-y-4 text-lg">
                        {tourData.inclusions.map((inc, index) => (
                          <li key={index} className="flex items-center text-green-500 mb-4">
                            <span className="mr-4 text-xl">&#10004;</span>
                            {inc}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 text-lg">No inclusions available.</p>
                    )}
                  </td>
                  <td className="px-8 py-6 border-b">
                    {Array.isArray(tourData.exclusions) && tourData.exclusions.length > 0 ? (
                      <ul className="list-none gap-y-4 text-lg">
                        {tourData.exclusions.map((exc, index) => (
                          <li key={index} className="flex items-center text-red-500 mb-4">
                            <span className="mr-4 text-xl">&#10008;</span>
                            {exc}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 text-lg">No exclusions available.</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Policies Section */}
            <div className="mt-12 space-y-12">
              <div>
                <h3 className="text-3xl font-semibold text-blue-900 mb-6">Refund Policies</h3>
                <p className="text-gray-700 text-lg mb-6 text-justify">
                  Refund policies are designed to uphold fairness and transparency, ensuring peace of mind for our valued travelers.
                </p>
                <ul className="list-disc pl-8 text-gray-800 text-lg leading-relaxed">
                  <li>Refunds are applicable under specific terms and conditions.</li>
                  <li>Review the cancellation policy before booking.</li>
                  <li>Refunds will be processed within 7–10 business days after confirmation.</li>
                </ul>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-3xl font-semibold text-blue-900 mb-6">Payment Methods</h3>
                <p className="text-gray-700 text-lg mb-6 text-justify">
                  We provide a variety of secure and convenient payment options..
                </p>
                <ul className="list-disc pl-8 text-gray-800 text-lg leading-relaxed">
                  <li>Credit cards and debit cards are accepted.</li>
                  <li>Secure online payment gateways available.</li>
                  <li>Bank transfers can be arranged for large amounts.</li>
                </ul>
              </div>

              {/* Payment Policies */}
              <div>
                <h3 className="text-3xl font-semibold text-blue-900 mb-6">Payment Policies</h3>
                <p className="text-gray-700 text-lg mb-6 text-justify">
                  To secure your booking, we require either full payment or a partial deposit.
                </p>
                <ul className="list-disc pl-8 text-gray-800 text-lg leading-relaxed">
                  <li>Full payment is required at the time of booking or as per the terms.</li>
                  <li>Deposits may be required for specific bookings.</li>
                  <li>Payments must be made according to the specified deadlines.</li>
                </ul>
              </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;