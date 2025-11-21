import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    password!: string;
}

export class LoginDto {
    @IsEmail({}, { message: "email must be a valid email address" })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: "password should not be empty" })
    password!: string;
}