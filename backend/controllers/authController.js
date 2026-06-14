// const jwt = require("jsonwebtoken");

// const login = async (req, res) => {
//   const { username, password } = req.body;

//   if (
//     username === "admin" &&
//     password === "admin123"
//   ) {
//     const token = jwt.sign(
//       { username },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d"
//       }
//     );

//     return res.json({ token });
//   }

//   return res.status(401).json({
//     message: "Invalid Credentials"
//   });
// };

// module.exports = { login };



const jwt = require("jsonwebtoken");

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "tom", password: "Tom123", role: "employee" },
  { username: "eren", password: "Eren123", role: "employee" },
  { username: "goku", password: "Goku123", role: "employee" },
  { username: "salaar", password: "Salaar123", role: "employee" },
  { username: "jerry", password: "jerry123", role: "employee" },
];

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid Credentials" });

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({ token, role: user.role, username: user.username });
};

module.exports = { login };