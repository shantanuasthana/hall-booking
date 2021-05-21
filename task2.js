const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const rooms = [];
const bookingData = [];

//Create Room
app.post("/create-room", function(req,res) {
    rooms.push({
        id: rooms.length+1,
        name: "Room"+rooms.length+1,
        numberOfSeats: req.body.seats,
        amenties: req.body.amenties,
        price: req.body.price,
        status: "available",
    });
    res.json({
        message: "Room Created",
    });
});

//Room Booking
app.post("/book-room", (req, res) => {
    let roomid = req.body.roomid;
    let isRoomPresent = rooms.findIndex((rooms) => rooms.id === roomid);
  
    //If room is present
    if (isRoomPresent > -1) {
      let roomStatus = bookingData.filter((item) => item.roomid === roomid);
      let flag = true;
  
      //Check availability of room
      roomStatus.map((item) => {
        if (item.date === req.body.date) {
          if (
            (req.body.startTime >= item.startTime &&
              req.body.startTime < item.endTime) ||
            (req.body.endTime > item.startTime && req.body.endTime < item.endTime)
          ) {
            flag = false;
          }
        }
      });
  
      //If room is available
      if (flag) {
        bookingData.push({
          customerName: req.body.name,
          date: req.body.date,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          roomid: req.body.roomid,
        });
        rooms[roomid - 1].status = "booked";
        res.json({
          message: "Booking has been done successfully.",
        });
      }
  
      //If room is already booked
      else {
        res.json({
          message: "Selected room is already booked for this time slot.",
        });
      }
    }
    //If room is not present
    else {
      res.json({
        message: "Selected room is not present.",
      });
    }
  });
  
  //List all rooms with booked data
  app.get("/all-rooms", (req, res) => {
    //Join operation
    const bookedRoomsData = rooms.map((item) => ({
      ...item,
      ...bookingData.find((record) => record.roomid === item.id),
    }));
  
    //Fetching only required data
    const finalData = bookedRoomsData.map((item) => {
      return {
        "Room name": item.name,
        "Booking status": item.status,
        "Customer name": item.customerName,
        "Date of event": item.date,
        "Start time": item.startTime,
        "End time": item.endTime,
      };
    });
    res.json(finalData);
  });
  
  //List all customers with booked data
  app.get("/all-customers", (req, res) => {
    //Join operation
    const bookedCustomerData = bookingData.map((item) => ({
      ...item,
      ...rooms.find((room) => room.id === item.roomid),
    }));
  
    //Fetching only required data
    const finalData = bookedCustomerData.map((item) => {
      return {
        "customer name": item.customerName,
        "date of event": item.date,
        "start time": item.startTime,
        "end time": item.endTime,
        "room name": item.name,
      };
    });
    res.json(finalData);
  });
  
  //Server
  app.get("/", (req, res) => {
    res.send("Hall booking application");
  });
  app.listen(PORT, () => {
    console.log("server is up and running");
  });