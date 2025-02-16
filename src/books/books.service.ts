import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { readFileSync, writeFileSync } from 'fs';

@Injectable()
export class BooksService {
  private books = [];
  private nextId = 1;

  constructor() {
    this.loadBooks();
  }

  private loadBooks() {
    try {
      const data = readFileSync('db.json', 'utf8');
      this.books = JSON.parse(data);
      this.nextId = this.books.length > 0 ? Math.max(...this.books.map(book => book.id)) + 1 : 1;
    } catch (error) {
      console.error('Error loading books:', error);
      this.books = [];
    }
  }

  private saveBooks() {
    try {
      writeFileSync('db.json', JSON.stringify(this.books, null, 2));
    } catch (error) {
      console.error('Error saving books:', error);
    }
  }

  create(createBookDto: CreateBookDto) {
    const newBook = { id: this.nextId++, ...createBookDto };
    this.books.push(newBook);
    this.saveBooks();
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
      this.saveBooks();
      return this.books[bookIndex];
    }
    return null;
  }

  remove(id: number) {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex > -1) {
      const removedBook = this.books.splice(bookIndex, 1);
      this.saveBooks();
      return removedBook[0];
    }
    return null;
  }
}