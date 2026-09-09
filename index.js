import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import modaluser from "./modaluser.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

mongoose .connect(process.env.MONGODB_URI) .then(() => { console.log("MongoDB Atlas connected"); }) .catch((err) => { console.log("MongoDB connection error:", err); });
// Home page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});
// Form submit route
app.post("/user", async function (req, res) {
  console.log(req.body);
// Form se email aur password lena
  const { email, password ,imageurl } = req.body;
// New user create karna
  const newuser = new modaluser({
    email: email,
    password: password,
    imageurl:imageurl
  });
  // MongoDB me save karna
  await newuser.save();
 // Response
  res.send(`Login submit successfully
  <a href="/read">Read Image</a> `)
});
//  app.get("/read", async function (req, res) {
//   try {
//     const users = await modaluser.find();

//     users.forEach((user) => {
//       console.log(user.email);
//       console.log(user.imageurl);
//     });

//     res.send(users);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error");
//   }
// });

app.get("/read", async function (req, res) {
  try {
    const users = await modaluser.find();

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Cards</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f2f2f2;
            padding: 30px;
          }

          h1 {
            text-align: center;
          }

          .container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
          }

          .card {
            width: 300px;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
          }

          .card img {
            width: 100%;
            height: 300px;
            object-fit: cover;
          }

          .content {
            padding: 20px;
          }

          .content h3 {
            margin: 0 0 10px;
          }

          .content p {
            color: #666;
            word-break: break-all;
          }
        </style>
      </head>

      <body>

        <h1>Users</h1>

        <div class="container">
    `;

    users.forEach((user) => {
      html += `
        <div class="card">

          <img
            src="${user.imageurl}"
            alt="User Image"
          />

          <div class="content">
            <h3>${user.email}</h3>
            
          </div>

        </div>
      `;
    });

    html += `
        </div>

      </body>
      </html>
    `;

    res.send(html);

  } catch (error) {
    console.log(error);
    res.status(500).send("Error reading data");
  }
});

// Server start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
})
