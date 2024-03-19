// Consts
const booksContainer = document.getElementById('booksContainer');
const addBookBtn = document.getElementById('addBookBtn');
const modal = document.getElementById('modal');
const deleteModal = document.getElementById('deleteModal');
const closeBtn = document.querySelector('.close');
const addBookForm = document.getElementById('addBook');
const darkModeToggle = document.getElementById('darkModeToggle');

// Vars
let books = [];
let bookToDeleteIndex = null;

// Fetch storage
if (localStorage.getItem('books')) {
  books = JSON.parse(localStorage.getItem('books'));
  renderBooks();
}

// Dark Mode
const isDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
if (isDarkModeEnabled) {
  document.body.classList.add('dark-mode'); // Class add for dark mode styles
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
  const darkModeEnabled = darkModeToggle.checked;
  document.body.classList.toggle('dark-mode', darkModeEnabled);
  localStorage.setItem('darkModeEnabled', darkModeEnabled);
});

// Add Book Btn
addBookBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Close Button
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Add Book Info
addBookForm.addEventListener('click', () => {
  const titleInput = document.getElementById('bookTitle');
  const authorInput = document.getElementById('bookAuthor');
  const totalPagesInput = document.getElementById('bookPages');
  const pagesReadInput = document.getElementById('pagesRead');

  const title = titleInput.value;
  const author = authorInput.value;
  const totalPages = parseInt(totalPagesInput.value);
  const pagesRead = parseInt(pagesReadInput.value) || 0;

  if (title && author && totalPages) {
    const newBook = {
      title: title,
      author: author,
      totalPages: totalPages,
      pagesRead: pagesRead
    };
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
    modal.style.display = 'none';
    
    titleInput.value = '';
    authorInput.value = '';
    totalPagesInput.value = '';
    pagesReadInput.value = '';
  } else {
    alert('Please fill in Title and Author fields, and Total Pages must be greater than 0.');
  }
});

// Delete
function showDeleteModal(index) {
  bookToDeleteIndex = index;
  deleteModal.style.display = 'block';
}

// Close Delete btn
function closeDeleteModal() {
  deleteModal.style.display = 'none';
}

// Delete confirm
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
  if (bookToDeleteIndex !== null) {
    books.splice(bookToDeleteIndex, 1);
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
    closeDeleteModal();
  }
});

// Cancel delete btn
document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
  closeDeleteModal();
});

// Event listener page upd
document.addEventListener('DOMContentLoaded', function () {
  const updateModal = document.getElementById('updateModal');
  const updatePagesBtn = document.getElementById('updatePagesBtn');
  const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
  const newPagesReadInput = document.getElementById('newPagesRead');

  let selectedBookIndex;

  function setupUpdateButtons() {
    const updateButtons = document.querySelectorAll('.read-pages-btn');
    updateButtons.forEach((button, index) => {
      button.removeEventListener('click', handleUpdateButtonClick);
      button.addEventListener('click', () => {
        handleUpdateButtonClick(index);
      });
    });
  }

  setupUpdateButtons(); 

  function handleUpdateButtonClick(index) {
    selectedBookIndex = index;
    updateModal.style.display = 'block';
    newPagesReadInput.value = books[selectedBookIndex].pagesRead;
  }

  updatePagesBtn.addEventListener('click', () => {
    const newPagesRead = parseInt(newPagesReadInput.value);
    if (!isNaN(newPagesRead) && newPagesRead >= 0 && newPagesRead <= books[selectedBookIndex].totalPages) {
      books[selectedBookIndex].pagesRead = newPagesRead;
      localStorage.setItem('books', JSON.stringify(books));
      renderBooks();
      updateModal.style.display = 'none';
      setupUpdateButtons(); 
    } else {
      if (isNaN(newPagesRead) || newPagesRead < 0) {
        alert('Please enter a valid non-negative number of pages.');
      } else {
        alert('You cannot enter a value greater than the total number of pages.');
      }
    }
  });

  cancelUpdateBtn.addEventListener('click', () => {
    updateModal.style.display = 'none';
    setupUpdateButtons(); 
  });
  document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      if (updateModal.style.display === 'block' && document.activeElement === newPagesReadInput) {
        updatePagesBtn.click();
      }
    }
  });
}); document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    if (updateModal.style.display === 'block' && document.activeElement === newPagesReadInput) {
      updatePagesBtn.click();
    }
  }
});

// Render/Call books sorted by title for now
function renderBooks() {
  books.sort((a, b) => a.title.localeCompare(b.title));

  booksContainer.innerHTML = '';
  books.forEach((book, index) => {
    const bookCard = document.createElement('div');

    const isBookCompleted = book.pagesRead === book.totalPages;

    if (isBookCompleted) {
      bookCard.classList.add('completed-book'); 
    } else {
      bookCard.classList.add('book-card');
    }

    bookCard.innerHTML = `
      <div class="book-info">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
      </div>
      <div class="book-progress">
        <p class="progress-pgn">${book.pagesRead} / ${book.totalPages} Pages</p>
        <button class="read-pages-btn">Update</button>
        <button class="delete-book-btn" onclick="showDeleteModal(${index})">Delete</button>
      </div>
    `;
    booksContainer.appendChild(bookCard);
  });
}
