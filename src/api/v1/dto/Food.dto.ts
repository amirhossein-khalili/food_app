import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFoodInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  foodType: string;

  @IsString()
  @IsNotEmpty()
  readyTime: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
