import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Rating, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tourGallery } from './imageGalleryData';
import PhoneIcon from '@mui/icons-material/Phone';


const ImageGallery = () => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/rooms/${id}`);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '70vh', padding: '20px 30px', backgroundColor: '#f9f9f9' }}>
      <Grid container spacing={5}>
        {tourGallery.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                },
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.images[0]}
                  alt={item.title}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      filter: 'brightness(0.85)',
                    },
                  }}
                  onClick={() => handleClick(item._id)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    padding: '10px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {item.days} days & {item.days - 1} nights
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ backgroundColor: '#fff', padding: '20px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold" fontSize={20}>
                    {item.title}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Rating name="read-only" value={4.5} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="textSecondary" ml={1}>
                      (23)
                    </Typography>
                  </Box>
                </Box>
                <Box >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 'bold',
                    }}
                    gutterBottom
                    display="flex" justifyContent="space-between" mb={1}
                  >
                    LKR {item.price.toLocaleString()} {' '}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ textDecoration: 'line-through', marginLeft: 1, color: 'text.secondary' }}
                    >
                      LKR {(item.price + 64185).toLocaleString()}
                    </Typography>{' '}
                    <Typography component="span" variant="body2" color="error" fontWeight="bold" backgroundColor="rgba(255, 87, 34, 0.2)" padding={0.5}> 
                      SAVE LKR 64,185
                    </Typography>
                  </Typography>
                </Box>
                <Box display="flex" gap={2} mt={3}>
                <Button
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    sx={{
                      borderColor: '#FF5722',
                      color: '#FF5722',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 87, 34, 0.1)',
                        borderColor: '#FF5722',
                      },
                    }}
                  >
                    Call
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#FF5722',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#E64A19',
                      },
                    }}
                  >
                    Request Callback
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageGallery;


// import React from 'react';
// import { Grid, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Rating from '@mui/material/Rating'; 
// import ClickablePicture from './ClickablePicture';
// import {tourGallery} from './imageGalleryData';

// const ImageGallery = () => {
//   const navigate = useNavigate(); 

//   const handleClick = (id) => {
//     //navigate(`/rooms/${id}`); 
//   };


//   return (
//     <div style={{  width: '100%', minHeight: '90vh', padding: '0px 0' }}>
//       <Grid container spacing={3}>
//         {tourGallery.map((item, index) => (
//           <Grid item xs={4} key={index}>
//             <ClickablePicture
//               imageUrl={item.images[0]}
//               onClick={() => handleClick(item._id)}
//             />
//             <div className="p-4">
//               <p className="text-gray-500 text-sm mb-1">{item.days} days & {item.days - 1} nights</p>
//               <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-bold">{item.title}</h2>
//                 <div className="flex items-center">
//                   <Rating
//                     name="read-only"
//                     value={4.5}
//                     precision={0.1}
//                     readOnly
//                     size="small"
//                   />
//                   <p className="text-gray-500 text-sm ml-1">(39)</p>
//                 </div>
//               </div>
//               <div className="text-yellow-600 font-bold mt-2 text-lg">5D Maldives</div>
//               <div className="mt-3">
//                 <p className="text-lg text-green-600 font-bold">
//                     USD {item.price}{" "}
//                   <span className="line-through text-gray-500 font-normal text-sm">
//                   USD {item.price - 250}
//                   </span>{" "}
//                   <span className="text-red-600 text-sm font-bold">
//                     SAVE USD 250
//                   </span>
//                 </p>
//               </div>
//               <div className="mt-4 flex items-center gap-3">
//                 <Button
//                   variant="outlined"
//                   startIcon={<i className="fas fa-phone"></i>}
//                   className="text-orange-600 border-orange-600 hover:bg-orange-50"
//                 >
//                   Call
//                 </Button>
//                 <Button
//                   variant="contained"
//                   className="bg-orange-600 text-white hover:bg-orange-700"
//                 >
//                   Request Callback
//                 </Button>
//               </div>
//             </div>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// };

// export default ImageGallery;