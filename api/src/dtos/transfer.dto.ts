import { IsNotEmpty, IsString, Matches } from "class-validator";

export class TransferDto {
  @IsString()
  @IsNotEmpty()
  toUserId!: string;

  // amount in paise string of digits, e.g., "5000"
  @IsString()
  @Matches(/^\d+$/, { message: "amount must be paise integer string" })
  amount!: string;
}
