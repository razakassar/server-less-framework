"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.Signup = void 0;
const password_1 = require("./utility/password");
// Simulate in-memory database using arrays
let users = [];
const Signup = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, phone } = JSON.parse(event.body);
        const salt = yield (0, password_1.GetSalt)();
        const hashedPassword = yield (0, password_1.GetHashedPassword)(password, salt);
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
    }
    catch (error) {
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
});
exports.Signup = Signup;
const Login = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = JSON.parse(event.body);
        const user = users.find((u) => u.email === email);
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }
        const verified = yield (0, password_1.ValidatePassword)(password, user.password, user.salt);
        if (!verified) {
            throw new Error("Password does not match");
        }
        const token = (0, password_1.GetToken)(user);
        return {
            Status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                "Success": "Login successful...."
            }),
        };
    }
    catch (error) {
        return {
            Status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                "ERROR": "Invalid Credentials"
            }),
        };
    }
});
exports.Login = Login;
//# sourceMappingURL=handler.js.map