// export default {
//   routes: [
//     {
//       _id: "",
//       stops: [
//         {
//           placeId: "",
//           coord: [0, 0],
//           _id: "",
//         },
//       ],
//       __v: 0,
//     },
//   ],
//   places: [
//     {
//       _id: "",
//       google_Id: "",
//       name: "",
//       coord: [0, 0],
//       img: "",
//       hours: [
//         "Monday: Open 24 hours",
//         "Tuesday: Open 24 hours",
//         "Wednesday: Open 24 hours",
//         "Thursday: Open 24 hours",
//         "Friday: Open 24 hours",
//         "Saturday: Open 24 hours",
//         "Sunday: Open 24 hours",
//       ],
//       type: "",
//       __v: 0,
//     },
//   ],
// };

/*
step2:
35.4685337
139.4401639

step3:
35.4694341
139.4415347
*/

/**
 * Bearing = atan2(X,Y)
 * X = cosine(latitude B) * sine(longitude b - longitude a)
 * Y = cosine(latitude a) * sine(latitude b) - sine(latitude a) * cosine(latitude b) *cosine (longitude b - longitude a)
 * 
 */



let lat_a = 35.4685337;
let long_a = 139.4401639;
let lat_b =  35.4694341;
let long_b =  139.4415347;

lat_a = degreeToRadian(lat_a);
lat_b = degreeToRadian(lat_b);
long_a = degreeToRadian(long_a);
long_b = degreeToRadian(long_b);

function deltaLong () {
    return degreeToRadian(Math.abs(long_b - long_a));
}

function degreeToRadian(degree: number) {
    return degree * Math.PI/180
} 

function x () {
    return Math.cos(lat_b) * Math.sin(deltaLong());
}

function y () {
    return Math.cos(lat_a) * Math.sin(lat_b) - Math.sin(lat_a) * Math.cos(lat_b) * Math.cos(deltaLong())
}

function radianToDegree(radian: number) {
  return radian * 180/Math.PI
}

function getBearing() {
  return radianToDegree(Math.atan2(x(), y()));
}


export {};