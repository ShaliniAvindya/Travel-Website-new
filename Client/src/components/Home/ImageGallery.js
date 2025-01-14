import React from 'react';
import { Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating'; 
import ClickablePicture from './ClickablePicture';
import {tourGallery} from './imageGalleryData';

const ImageGallery = () => {
  const navigate = useNavigate(); 

  const handleClick = (id) => {
    //navigate(`/rooms/${id}`); 
  };


  return (
    <div style={{  width: '100%', minHeight: '90vh', padding: '0px 0' }}>
      <Grid container spacing={3}>
        {tourGallery.map((item, index) => (
          <Grid item xs={4} key={index}>
            <ClickablePicture
              imageUrl={item.images[0]}
              onClick={() => handleClick(item._id)}
            />
            <div className="p-4">
              <p className="text-gray-500 text-sm mb-1">{item.days} days & {item.days - 1} nights</p>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <div className="flex items-center">
                  <Rating
                    name="read-only"
                    value={4.5}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <p className="text-gray-500 text-sm ml-1">(39)</p>
                </div>
              </div>
              <div className="text-yellow-600 font-bold mt-2 text-lg">5D Maldives</div>
              <div className="mt-3">
                <p className="text-lg text-green-600 font-bold">
                    USD {item.price}{" "}
                  <span className="line-through text-gray-500 font-normal text-sm">
                  USD {item.price - 250}
                  </span>{" "}
                  <span className="text-red-600 text-sm font-bold">
                    SAVE USD 250
                  </span>
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button
                  variant="outlined"
                  startIcon={<i className="fas fa-phone"></i>}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  Call
                </Button>
                <Button
                  variant="contained"
                  className="bg-orange-600 text-white hover:bg-orange-700"
                >
                  Request Callback
                </Button>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ImageGallery;


// import React from 'react';
// import { Grid, Button, Card, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { tourGallery } from './imageGalleryData';

// const ImageGallery = () => {
//   const navigate = useNavigate();

//   const handleClick = (id) => {
//     navigate(`/rooms/${id}`);
//   };

//   return (
//     <Box sx={{ width: '100%', minHeight: '90vh', padding: '20px', backgroundColor: '#f9f9f9' }}>
//       <Grid container spacing={4}>
//         {tourGallery.map((item, index) => (
//           <Grid item xs={12} sm={6} md={4} key={index}>
//             <Card
//               sx={{
//                 boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                 '&:hover': {
//                   transform: 'scale(1.05)',
//                   boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
//                 },
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 height="200"
//                 image={item.images[0]}
//                 alt={item.title}
//                 sx={{
//                   borderRadius: '4px 4px 0 0',
//                   cursor: 'pointer',
//                   '&:hover': {
//                     filter: 'brightness(0.9)',
//                   },
//                 }}
//                 onClick={() => handleClick(item._id)}
//               />
//               <CardContent sx={{ padding: '20px' }}>
//                 <Typography variant="body2" color="textSecondary" gutterBottom>
//                   {item.days} days & {item.days - 1} nights
//                 </Typography>
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                   <Typography variant="h6" component="h2" fontWeight="bold">
//                     {item.title}
//                   </Typography>
//                   <Box display="flex" alignItems="center">
//                     <Rating name="read-only" value={4.5} precision={0.1} readOnly size="small" />
//                     <Typography variant="body2" color="textSecondary" ml={1}>
//                       (39)
//                     </Typography>
//                   </Box>
//                 </Box>
//                 <Typography variant="body1" color="primary" fontWeight="bold" gutterBottom>
//                   5D Maldives
//                 </Typography>
//                 <Typography variant="h6" color="textPrimary" fontWeight="bold" gutterBottom>
//                   USD {item.price}{' '}
//                   <Typography
//                     component="span"
//                     variant="body2"
//                     color="textSecondary"
//                     sx={{ textDecoration: 'line-through', marginLeft: 1 }}
//                   >
//                     USD {item.price - 250}
//                   </Typography>{' '}
//                   <Typography component="span" variant="body2" color="error" fontWeight="bold">
//                     SAVE USD 250
//                   </Typography>
//                 </Typography>
//                 <Box display="flex" gap={2} mt={2}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<i className="fas fa-phone"></i>}
//                     sx={{
//                       color: '#FF5722',
//                       borderColor: '#FF5722',
//                       '&:hover': {
//                         backgroundColor: 'rgba(255, 87, 34, 0.1)',
//                         borderColor: '#FF5722',
//                       },
//                     }}
//                   >
//                     Call
//                   </Button>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       backgroundColor: '#FF5722',
//                       color: '#fff',
//                       '&:hover': {
//                         backgroundColor: '#E64A19',
//                       },
//                     }}
//                   >
//                     Request Callback
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default ImageGallery;
