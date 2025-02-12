import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { readFileSync, writeFileSync } from 'fs';

@Injectable()
export class BooksService {
  nextid = 2;
  book = readFileSync('db.json', 'utf8');

  books = JSON.parse(this.book);

  create(createBookDto: CreateBookDto) {
    const newBook = { id: this.nextid, ...createBookDto };
    this.books.push(newBook);
    this.nextid++;
    writeFileSync('db.json', JSON.stringify(this.books));
    return newBook;
  }

  findAll({ page, limit, sortBy, order }) {
    const sortedBooks = this.books.sort((a, b) => {
      if (order === 'ASC') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return sortedBooks.slice(startIndex, endIndex);
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex > -1) {
      this.books[bookIndex] = { ...this.books[bookIndex], ...updateBookDto };
      return this.books[bookIndex];
    }
    return null;
  }

  remove(id: number) {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex > -1) {
      const removedBook = this.books.splice(bookIndex, 1);
      return removedBook[0];
    }
    return null;
  }
}
