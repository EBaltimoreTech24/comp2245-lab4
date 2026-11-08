const form = document.querySelector('form');
const subjectList = document.querySelector('#subject');

async function loadSubjects() {
    const response = await fetch('subjects.php');
    if (!response.ok) {
        throw new Error('Could not load subjects');
    }
    const subjects = await response.json();

    for (const s of subjects) {
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = s.name;
        subjectList.append(option);
    }
}

const statusEl = document.querySelector('#status');
const tbody = document.querySelector('#results tbody');

async function loadBooks() {
    const params = new URLSearchParams(new FormData(form));
    const response = await fetch(`books.php?${params}`);
    if (!response.ok) {
        throw new Error('Could not load books');
    }
    const books = await response.json();

    tbody.replaceChildren();

    for (const book of books) {
        const row = document.createElement('tr');
        const cells = [
            book.title,
            book.author,
            book.year,
            book.subject,
            `${book.available} of ${book.copies}`,
        ];
        for (const text of cells) {
            const td = document.createElement('td');
            td.textContent = text;
            row.append(td);
        }
        if (book.available === 0) {
            row.lastElementChild.classList.add('out');
        }
        tbody.append(row);
    }

    if (books.length === 0) {
        statusEl.textContent = 'No books match your search.';
    } else if (books.length === 1) {
        statusEl.textContent = '1 book found.';
    } else {
        statusEl.textContent = `${books.length} books found.`;
    }
}

loadSubjects().catch(console.error);
loadBooks().catch(console.error);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    loadBooks().catch(console.error);
});