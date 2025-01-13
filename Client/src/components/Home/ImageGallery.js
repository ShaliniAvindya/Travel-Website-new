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

  // return(
  //   <div style={{  width: '100%', minHeight: '90vh', padding: '0px 0' }}>
  //   <Grid container spacing={3}>
  //   {tourGallery.map((item, index) => (
  //   <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
  //     <img
  //       src={item.images[0]}
  //       alt="Tour Package"
  //       className="w-full h-48 object-cover"
  //     />
  //     <div className="p-4">
  //       <p className="text-gray-500 text-sm mb-1">{item.days} days & {item.days - 1} nights</p>
  //       <div className="flex items-center justify-between">
  //         <h2 className="text-lg font-bold">{item.title}</h2>
  //         <div className="flex items-center">
  //           <Rating
  //             name="read-only"
  //             value={4.5}
  //             precision={0.1}
  //             readOnly
  //             size="small"
  //           />
  //           <p className="text-gray-500 text-sm ml-1">(39)</p>
  //         </div>
  //       </div>
  //       <div className="text-yellow-600 font-bold mt-2 text-lg">5D Maldives</div>
  //       <div className="mt-3">
  //         <p className="text-lg text-green-600 font-bold">
  //             USD {item.price}{" "}
  //           <span className="line-through text-gray-500 font-normal text-sm">
  //           USD {item.price - 250}
  //           </span>{" "}
  //           <span className="text-red-600 text-sm font-bold">
  //             SAVE USD 250
  //           </span>
  //         </p>
  //       </div>
  //       <div className="mt-4 flex items-center gap-3">
  //         <Button
  //           variant="outlined"
  //           startIcon={<i className="fas fa-phone"></i>}
  //           className="text-orange-600 border-orange-600 hover:bg-orange-50"
  //         >
  //           Call
  //         </Button>
  //         <Button
  //           variant="contained"
  //           className="bg-orange-600 text-white hover:bg-orange-700"
  //         >
  //           Request Callback
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  //   ))}
  //   </Grid>
  //   </div>
  // );

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
