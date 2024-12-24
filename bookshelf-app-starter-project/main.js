document.addEventListener("DOMContentLoaded", function () {
  let books = []; 
  const RENDER_EVENT = "render-books";

  if (localStorage.getItem('books')) {
    books = JSON.parse(localStorage.getItem('books'));
  }

  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value, 10);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const bookObject = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };

    books.push(bookObject); 
    saveBooksToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT)); 
    bookForm.reset(); 
  });

  
  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    const query = document.getElementById("searchBookTitle").value.toLowerCase(); 

    
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
    renderBooks(filteredBooks);
  });

  
  document.addEventListener(RENDER_EVENT, function () {
    renderBooks(books);
  });

  
  function renderBooks(filteredBooks) {
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    for (const book of filteredBooks) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    }
  }

  function createBookElement(book) {
    const bookContainer = document.createElement("div");
    bookContainer.setAttribute("data-bookid", book.id);
    bookContainer.setAttribute("data-testid", "bookItem");

    const bookTitle = document.createElement("h3");
    bookTitle.setAttribute("data-testid", "bookItemTitle");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.setAttribute("data-testid", "bookItemAuthor");
    bookAuthor.innerText = `Penulis: ${book.author}`;

    const bookYear = document.createElement("p");
    bookYear.setAttribute("data-testid", "bookItemYear");
    bookYear.innerText = `Tahun: ${book.year}`;

    const actionContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.innerText = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    toggleButton.addEventListener("click", function () {
      book.isComplete = !book.isComplete;
      saveBooksToLocalStorage();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      const index = books.findIndex((item) => item.id === book.id);
      if (index !== -1) books.splice(index, 1);
      saveBooksToLocalStorage();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });

    actionContainer.append(toggleButton, deleteButton);
    bookContainer.append(bookTitle, bookAuthor, bookYear, actionContainer);
    return bookContainer;
  }

  function saveBooksToLocalStorage(){
    localStorage.setItem('books', JSON.stringify(books));
  }
});
