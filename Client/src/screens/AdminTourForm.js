import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
} from '@mui/material';

const AdminTourForm = () => {
  const [tour, setTour] = useState({
    title: '',
    description: '',
    days: '',
    price: '',
    imageUrls: [],
  });
  const [allFeatures, setAllFeatures] = useState([]);
  const { tourId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      if (tourId) {
        try {
          const response = await axios.get(`http://localhost:5000/tours/${tourId}`);
          setTour(response.data.tour);
        } catch (error) {
          console.error("Error fetching tour:", error);
        }
      }
    };

    fetchTour();
  }, [TourId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tourId) {
        // Update existing tour
        await axios.put(`http://localhost:5000/tours/${tourId}`, tour);
      } else {
        // Create new tour
        await axios.post('http://localhost:5000/tours', tour);
      }
      navigate('/admin'); 
    } catch (error) {
      console.error("Error saving tour:", error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {tourId ? 'Edit Tour' : 'Add Tour'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tour Name"
                name="title"
                value={tour.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Days"
                name="days"
                value={tour.days}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price"
                name="price"
                value={tour.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {tourId ? 'Update Tour' : 'Add Tour'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminTourForm;
