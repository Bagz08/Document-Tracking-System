import bcrypt from "bcryptjs";

const password = "helloworld";
bcrypt.hash(password, 10).then(console.log);