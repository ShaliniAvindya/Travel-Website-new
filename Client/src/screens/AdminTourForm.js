// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   TextField,
//   Button,
//   Grid,
//   Typography,
//   Tab,
//   Tabs,
//   Box,
//   Card,
//   CardContent,
// } from '@mui/material';

// const AdminTourForm = () => {
//   const [tour, setTour] = useState({
//     title: '',
//     description: '',
//     days: '',
//     price: '',
//     inclusions: [],
//     exclusions: [],
//     images: [],  // Array to hold image URLs
//     itinerary: [], // Itinerary array for each day
//   });
//   const { tourId } = useParams();
//   const navigate = useNavigate();
//   const [selectedTab, setSelectedTab] = useState(0); // State for handling tabs

//   // Fetching tour data for editing, if tourId exists
//   useEffect(() => {
//     const fetchTour = async () => {
//       if (tourId) {
//         try {
//           const response = await axios.get(`http://localhost:5000/tours/${tourId}`);
//           setTour(response.data); // Populating tour data when editing an existing tour
//         } catch (error) {
//           console.error("Error fetching tour:", error);
//         }
//       }
//     };

//     fetchTour();
//   }, [tourId]);

//   // Handle input changes in the form
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTour((prevTour) => ({
//       ...prevTour,
//       [name]: value,
//     }));
//   };

//   // Handle form submission for creating or updating a tour
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (tourId) {
//         // Update the existing tour
//         await axios.put(`http://localhost:5000/tours/${tourId}`, tour);
//       } else {
//         // Create a new tour
//         await axios.post('http://localhost:5000/tours', tour);
//       }
//       navigate('/admin'); // Redirect to admin page after form submission
//     } catch (error) {
//       console.error("Error saving tour:", error);
//     }
//   };

//   // Handle tab changes
//   const handleTabChange = (event, newValue) => {
//     setSelectedTab(newValue);
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           {tourId ? 'Edit Tour' : 'Add Tour'}
//         </Typography>

//         {/* Tab Navigation */}
//         <Box>
//           <Tabs value={selectedTab} onChange={handleTabChange} centered>
//             <Tab label="Tour Details" />
//             <Tab label="Itinerary" />
//             <Tab label="Inclusions & Exclusions" />
//             <Tab label="Images" />
//           </Tabs>

//           {/* Form Content Based on Tab Selection */}
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               {/* Tour Details Tab */}
//               {selectedTab === 0 && (
//                 <>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Tour Name"
//                       name="title"
//                       value={tour.title}
//                       onChange={handleChange}
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       label="Days"
//                       name="days"
//                       value={tour.days}
//                       onChange={handleChange}
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       label="Price"
//                       name="price"
//                       value={tour.price}
//                       onChange={handleChange}
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       label="Description"
//                       name="description"
//                       value={tour.description}
//                       onChange={handleChange}
//                       fullWidth
//                       multiline
//                       rows={4}
//                     />
//                   </Grid>
//                 </>
//               )}

//               {/* Itinerary Tab */}
//               {selectedTab === 1 && (
//                 <>
//                   <Grid item xs={12}>
//                     <TextField
//                       label="Itinerary"
//                       name="itinerary"
//                       value={tour.itinerary}
//                       onChange={handleChange}
//                       fullWidth
//                       multiline
//                       rows={4}
//                     />
//                   </Grid>
//                 </>
//               )}

//               {/* Inclusions & Exclusions Tab */}
//               {selectedTab === 2 && (
//                 <>
//                   <Grid item xs={6}>
//                     <TextField
//                       label="Inclusions"
//                       name="inclusions"
//                       value={tour.inclusions}
//                       onChange={handleChange}
//                       fullWidth
//                       multiline
//                       rows={4}
//                     />
//                   </Grid>
//                   <Grid item xs={6}>
//                     <TextField
//                       label="Exclusions"
//                       name="exclusions"
//                       value={tour.exclusions}
//                       onChange={handleChange}
//                       fullWidth
//                       multiline
//                       rows={4}
//                     />
//                   </Grid>
//                 </>
//               )}

//               {/* Images Tab */}
//               {selectedTab === 3 && (
//                 <>
//                   <Grid item xs={12}>
//                     <TextField
//                       label="Image URLs"
//                       name="images"
//                       value={tour.images}
//                       onChange={handleChange}
//                       fullWidth
//                       multiline
//                       rows={4}
//                     />
//                   </Grid>
//                 </>
//               )}

//               {/* Submit Button */}
//               <Grid item xs={12}>
//                 <Button type="submit" variant="contained" color="primary">
//                   {tourId ? 'Update Tour' : 'Add Tour'}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default AdminTourForm;
