const modal = document.getElementById("bookModal");
const span = document.getElementsByClassName("close")[0];
const form = document.getElementById("book-form");
const modalTitle = document.getElementById("modal-title");
const bookIdInput = document.getElementById("book-id");
const pageNumberSpan = document.getElementById("page-number");
let currentPage = 1;
const booksPerPage = 15;

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

form.onsubmit = function (event) {
    event.preventDefault();
    const id = bookIdInput.value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = parseInt(document.getElementById("year").value, 10);
    const genre = document.getElementById("genre").value;
    const pages = parseInt(document.getElementById("pages").value, 10);
    const available = document.getElementById("available").checked;

    const book = { title, author, year, genre, pages, available };

    if (id) {
        fetch(`http://localhost:3000/books/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                loadBooks();
                modal.style.display = "none";
            })
            .catch(error => console.error('Hiba:', error));
    } else {
        fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                loadBooks();
                modal.style.display = "none";
            })
            .catch(error => console.error('Hiba:', error));
    }
}

function loadBooks() {
    const sortBy = document.getElementById('sort-by').value;
    const order = document.getElementById('order').value;
    fetch(`http://localhost:3000/books?sortBy=${sortBy}&order=${order}&page=${currentPage}&limit=${booksPerPage}`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('books-list');
            list.innerHTML = '';

            data.forEach(book => {
                const div = document.createElement('div');
                div.className = 'book-card';
                div.innerHTML = `
                            <h2>${book.author} - ${book.title}</h2>
                            <p>Kiadás éve: ${book.year}</p>
                            <p>Műfaj: ${book.genre}</p>
                            <p>Oldalszám: ${book.pages}</p>
                            <p>Elérhető: ${book.available ? 'Igen' : 'Nem'}</p>
                            <button class="edit" onclick="openEditModal(${book.id}, '${book.title}', '${book.author}', ${book.year}, '${book.genre}', ${book.pages}, ${book.available})">Szerkesztés</button>
                            <button class="delete" onclick="deleteBook(${book.id})">Törlés</button>
                        `;
                list.appendChild(div);
            });
        })
        .catch(error => console.error('Hiba:', error));
}

function deleteBook(id) {
    if (confirm('Biztosan törölni szeretnéd ezt a könyvet?')) {
        fetch(`http://localhost:3000/books/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                loadBooks();
            })
            .catch(error => console.error('Hiba:', error));
    }
}

function openEditModal(id, title, author, year, genre, pages, available) {
    bookIdInput.value = id;
    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("year").value = year;
    document.getElementById("genre").value = genre;
    document.getElementById("pages").value = pages;
    document.getElementById("available").checked = available;
    modalTitle.innerText = "Könyv szerkesztése";
    modal.style.display = "block";
}

document.getElementById('new-book-btn').onclick = function () {
    bookIdInput.value = '';
    form.reset();
    modalTitle.innerText = "Új könyv hozzáadása";
    modal.style.display = "block";
};

document.getElementById('sort-by').onchange = loadBooks;
document.getElementById('order').onchange = loadBooks;

document.getElementById('prev-page').onclick = function () {
    if (currentPage > 1) {
        currentPage--;
        pageNumberSpan.innerText = currentPage;
        loadBooks();
    }
};

document.getElementById('next-page').onclick = function () {
    currentPage++;
    pageNumberSpan.innerText = currentPage;
    loadBooks();
};

loadBooks();