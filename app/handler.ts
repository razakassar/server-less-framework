
import { APIGatewayProxyEventV2 } from "aws-lambda";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword,
  GetToken,
} from "./utility/password";

// Simulate in-memory database using arrays
let users: any = [];

export const Signup = async (event: APIGatewayProxyEventV2) => {
  try {
    const { email, password, phone } = JSON.parse(event.body);
    const salt = await GetSalt();
    const hashedPassword = await GetHashedPassword(password, salt);
    const newUser = {
      email: email,
      password: hashedPassword,
      phone: phone,
      userType: "BUYER",
      salt: salt,
    };
    // Simulate saving user to the database
    users.push(newUser);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "Success": newUser
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "ERROR": "Invalid data"
      }),
    };
  }
};

export const Login = async (event: APIGatewayProxyEventV2) => {
  try {
    const { email, password } = JSON.parse(event.body);
    const user = users.find((u: { email: string; }) => u.email === email);
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }
    const verified = await ValidatePassword(
      password,
      user.password,
      user.salt
    );
    if (!verified) {
      throw new Error("Password does not match");
    }
    const token = GetToken(user);
    return {
      Status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "Success": token
      }),
    };
  } catch (error) {
    return {
      Status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error }),
    };
  }
};