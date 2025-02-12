import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
    @IsString()
    @IsNotEmpty()
    author?: string;

    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsInt()
    @IsNotEmpty()
    year?: number;

    @IsString()
    @IsNotEmpty()
    genre?: string;

    @IsInt()
    @IsNotEmpty()
    pages?: number;

    @IsBoolean()
    @IsNotEmpty()
    available?: boolean;
}
