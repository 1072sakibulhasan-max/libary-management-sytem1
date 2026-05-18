// ============================================================
// Premier University Library - Core Data Engine with API integration
// Designed & Developed by Loop Infinity
// Team: sakibul hasan :0222420005101072 , mohamad fahim :0222420005101077 ,joynta chowdhuri onik :0222420005101054 , mohamad tarek aziz  :0222420005101073 
// ============================================================

const PULib = (function(){
  const API_BASE = '/api';
  const TOKEN_KEY = 'pu_token';
  const USER_KEY = 'pu_user';

  const defaultBooks = [
    {id:1,title:'Data Structures & Algorithms',author:'Mark Allen Weiss',isbn:'978-0132576277',category:'CSE',quantity:5,available:4,status:'Available',addedDate:'2026-01-10'},
    {id:2,title:'Java: The Complete Reference',author:'Herbert Schildt',isbn:'978-1260440249',category:'CSE',quantity:3,available:1,status:'Available',addedDate:'2026-01-12'},
    {id:3,title:'Operating System Concepts',author:'Silberschatz & Galvin',isbn:'978-1118063330',category:'CSE',quantity:4,available:4,status:'Available',addedDate:'2026-01-15'},
    {id:4,title:'Engineering Mathematics',author:'K.A. Stroud',isbn:'978-0831134709',category:'Mathematics',quantity:6,available:5,status:'Available',addedDate:'2026-01-18'},
    {id:5,title:'Digital Logic Design',author:'Morris Mano',isbn:'978-0131989245',category:'EEE',quantity:4,available:3,status:'Available',addedDate:'2026-01-20'},
    {id:6,title:'Computer Networks',author:'Andrew Tanenbaum',isbn:'978-0132126953',category:'CSE',quantity:3,available:0,status:'Issued',addedDate:'2026-02-01'},
  ];

  const defaultNotices = [
    {id:1,text:'📢 New books have been added this week. Check the book list!',date:'2026-03-01',by:'Admin'},
    {id:2,text:'📢 Library will remain closed on Friday due to maintenance.',date:'2026-03-04',by:'Admin'},
    {id:3,text:'📢 Students must return issued books within 14 days to avoid fines.',date:'2026-03-05',by:'Admin'},
  ];

  function getToken(){return sessionStorage.getItem(TOKEN_KEY);}
  function setToken(token){
    if(token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  }
  function saveCurrentUser(user){
    if(user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(USER_KEY);
  }

  function authHeaders(){
    const token = getToken();
    return token ? { Authorization: 'Bearer ' + token } : {};
  }

  function normalizeItem(item){
    if (item && item._id && !item.id) {
      item.id = item._id;
    }
    return item;
  }

  function normalizeList(list){
    if (!Array.isArray(list)) return list;
    return list.map(normalizeItem);
  }

  async function apiFetch(path, options = {}){
    const opts = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options.headers,
      },
      ...options,
    };
    if (opts.body && typeof opts.body !== 'string') {
      opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(API_BASE + path, opts);
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
      throw new Error(data.error || res.statusText || 'Request failed');
    }
    return data;
  }

  async function loginAccount(payload){
    const data = await apiFetch('/auth/login', { method: 'POST', body: payload });
    if (data.token) {
      setToken(data.token);
      saveCurrentUser(data.user);
      localStorage.setItem('isLoggedIn', 'true');
    }
    return data;
  }

  async function registerAccount(payload){
    const data = await apiFetch('/auth/register', { method: 'POST', body: payload });
    if (data.token) {
      setToken(data.token);
      saveCurrentUser(data.user);
      localStorage.setItem('isLoggedIn', 'true');
    }
    return data;
  }

  async function fetchMe(){
    return apiFetch('/auth/me');
  }

  async function fetchBooks(){
    const books = normalizeList(await apiFetch('/books')) || [];
    set('books', books);
    return books;
  }

  async function fetchBookById(id){
    return normalizeItem(await apiFetch(`/books/${id}`));
  }

  async function createBook(book){
    const created = normalizeItem(await apiFetch('/books', { method: 'POST', body: book }));
    const books = get('books') || [];
    set('books', [created, ...books]);
    return created;
  }

  async function updateBook(id, book){
    const updated = normalizeItem(await apiFetch(`/books/${id}`, { method: 'PUT', body: book }));
    const books = get('books') || [];
    set('books', books.map(b => ((b._id === updated._id || b.id === updated._id) ? updated : b)));
    return updated;
  }

  async function deleteBook(id){
    await apiFetch(`/books/${id}`, { method: 'DELETE' });
    const books = get('books') || [];
    set('books', books.filter(b => b._id !== id && b.id !== id));
  }

  async function fetchIssues(){
    const issues = normalizeList(await apiFetch('/issues')) || [];
    set('issues', issues);
    return issues;
  }

  async function issueBook(payload){
    const issue = normalizeItem(await apiFetch('/issues', { method: 'POST', body: payload }));
    const issues = get('issues') || [];
    set('issues', [issue, ...issues]);
    await fetchBooks();
    return issue;
  }

  async function returnIssue(id){
    const issue = normalizeItem(await apiFetch(`/issues/${id}/return`, { method: 'PUT' }));
    const issues = get('issues') || [];
    set('issues', issues.map(i => ((i._id === issue._id || i.id === issue._id) ? issue : i)));
    await fetchBooks();
    return issue;
  }

  async function fetchFiles(){
    const files = normalizeList(await apiFetch('/files')) || [];
    set('files', files);
    return files;
  }

  async function uploadFile(payload){
    const file = normalizeItem(await apiFetch('/files', { method: 'POST', body: payload }));
    const files = get('files') || [];
    set('files', [file, ...files]);
    return file;
  }

  async function deleteFile(id){
    await apiFetch(`/files/${id}`, { method: 'DELETE' });
    const files = get('files') || [];
    set('files', files.filter(f => f._id !== id && f.id !== id));
  }

  async function fetchNotices(){
    const notices = normalizeList(await apiFetch('/notices')) || [];
    set('notices', notices);
    return notices;
  }

  async function createNotice(text){
    const notice = normalizeItem(await apiFetch('/notices', { method: 'POST', body: { text } }));
    const notices = get('notices') || [];
    set('notices', [notice, ...notices]);
    return notice;
  }

  async function deleteNotice(id){
    await apiFetch(`/notices/${id}`, { method: 'DELETE' });
    const notices = get('notices') || [];
    set('notices', notices.filter(n => n._id !== id && n.id !== id));
  }

  async function fetchFeedback(){
    const feedback = normalizeList(await apiFetch('/feedback')) || [];
    set('feedback', feedback);
    return feedback;
  }

  async function sendFeedback(payload){
    const feedback = normalizeItem(await apiFetch('/feedback', { method: 'POST', body: payload }));
    return feedback;
  }

  async function fetchUsers(){
    const users = normalizeList(await apiFetch('/users')) || [];
    return users;
  }

  async function syncData(){
    await Promise.allSettled([
      fetchBooks(),
      fetchIssues(),
      fetchFiles(),
      fetchNotices(),
    ]);
  }

  async function init(){
    const token = getToken();
    if (token) {
      try {
        const response = await fetchMe();
        if (response && response.user) {
          saveCurrentUser(response.user);
        }
      } catch (err) {
        console.warn('Session refresh failed:', err.message);
        logout();
      }
    }
    await syncData();
  }

  const ready = init();

  function currentUser(){
    try { return JSON.parse(sessionStorage.getItem(USER_KEY)); } catch { return null; }
  }

  function syncLoginState(){
    const loggedIn = !!currentUser();
    localStorage.setItem('isLoggedIn', loggedIn ? 'true' : 'false');
    return loggedIn;
  }

  function requireAuth(role){
    const u = currentUser();
    if (!u) { window.location.href='index.html'; return null; }
    if (role && u.role !== role && u.role !== 'admin') { window.location.href='index.html'; return null; }
    syncLoginState();
    return u;
  }

  function logout(){
    setToken(null);
    saveCurrentUser(null);
    syncLoginState();
    window.location.href='home.html';
  }

  function get(k){
    try { return JSON.parse(localStorage.getItem('pu_' + k) || 'null'); } catch { return null; }
  }

  function set(k, v){
    localStorage.setItem('pu_' + k, JSON.stringify(v));
  }

  function nextId(arr){
    if (!Array.isArray(arr) || !arr.length) return 1;
    const numericIds = arr
      .map(x => Number(x && x.id))
      .filter(n => Number.isFinite(n) && n >= 0);
    return numericIds.length ? Math.max(...numericIds) + 1 : Date.now();
  }

  function getBooks(){
    const b = get('books');
    if (b) return b;
    set('books', defaultBooks);
    ready.catch(() => {});
    return defaultBooks;
  }

  function saveBooks(b){ set('books', b); }
  function getIssues(){ return get('issues') || []; }
  function saveIssues(i){ set('issues', i); }
  function getFiles(){ return get('files') || []; }
  function saveFiles(f){ set('files', f); }
  function getNotices(){
    const n = get('notices');
    if (n) return n;
    set('notices', defaultNotices);
    return defaultNotices;
  }
  function saveNotices(n){ set('notices', n); }
  function getFeedback(){ return get('feedback') || []; }
  function saveFeedback(f){ set('feedback', f); }
  function getAccounts(){ return get('accounts') || []; }

  function getNoticesAsXML(){
    const notices = getNotices();
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<notices>\n';
    notices.forEach(function(n){
      xml += '  <notice id="' + n.id + '">\n';
      xml += '    <text>' + escHtml(n.text) + '</text>\n';
      xml += '    <date>' + n.date + '</date>\n';
      xml += '    <by>' + escHtml(n.by) + '</by>\n';
      xml += '  </notice>\n';
    });
    xml += '</notices>';
    return xml;
  }

  function formatDate(d){
    if(!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  }
  function today(){ return new Date().toISOString().slice(0,10); }
  function addDays(dateStr,n){ const d = new Date(dateStr); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }
  function isOverdue(dueDate){ return dueDate && new Date(dueDate) < new Date(); }
  function escHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function readFileAsBase64(file){
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  function showAlert(id, msg, type){
    const el = document.getElementById(id);
    if (!el) {
      alert(msg);
      return;
    }
    el.textContent = msg;
    el.className = 'alert alert-' + type + ' show';
    setTimeout(() => el.classList.remove('show'), 3500);
  }

  function openModal(id){
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    // Keep modal compatible with pages that may not use .open in CSS.
    el.style.display = 'flex';
  }
  function closeModal(id){
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    el.style.display = '';
  }

  function clearAddBookForm(){
    const titleEl = document.getElementById('b_title');
    const authorEl = document.getElementById('b_author');
    const isbnEl = document.getElementById('b_isbn');
    const catEl = document.getElementById('b_cat');
    const qtyEl = document.getElementById('b_qty');
    const fileEl = document.getElementById('b_file');
    const coverEl = document.getElementById('b_cover');

    if (titleEl) titleEl.value = '';
    if (authorEl) authorEl.value = '';
    if (isbnEl) isbnEl.value = '';
    if (catEl) catEl.selectedIndex = 0;
    if (qtyEl) qtyEl.value = '1';
    if (fileEl) fileEl.value = '';
    if (coverEl) coverEl.value = '';
  }

  async function addBook(){
    const titleEl = document.getElementById('b_title');
    const authorEl = document.getElementById('b_author');
    const isbnEl = document.getElementById('b_isbn');
    const catEl = document.getElementById('b_cat');
    const qtyEl = document.getElementById('b_qty');
    const fileEl = document.getElementById('b_file');
    const coverEl = document.getElementById('b_cover');

    const title = titleEl ? titleEl.value.trim() : '';
    const author = authorEl ? authorEl.value.trim() : '';

    if (!title || !author) {
      showAlert('bookAlert', 'Title and Author are required.', 'error');
      return;
    }

    const books = getBooks();
    const quantity = qtyEl ? Math.max(1, parseInt(qtyEl.value, 10) || 1) : 1;

    const entry = {
      id: nextId(books),
      title: title,
      author: author,
      isbn: isbnEl ? isbnEl.value.trim() : '',
      category: catEl ? catEl.value : 'Other',
      quantity: quantity,
      available: quantity,
      addedDate: today(),
      status: 'Available'
    };

    try {
      const pdfFile = fileEl && fileEl.files ? fileEl.files[0] : null;
      if (pdfFile) {
        entry.fileData = await readFileAsBase64(pdfFile);
        entry.fileName = pdfFile.name;
      }

      const coverFile = coverEl && coverEl.files ? coverEl.files[0] : null;
      if (coverFile) {
        entry.coverImage = await readFileAsBase64(coverFile);
        entry.coverFileName = coverFile.name;
      }
    } catch (err) {
      showAlert('bookAlert', 'Failed to read selected file(s). Please try again.', 'error');
      return;
    }

    books.push(entry);
    saveBooks(books);

    clearAddBookForm();
    closeModal('addBookModal');
    showAlert('bookAlert', 'Book added successfully!', 'success');

    if (typeof window.renderBooks === 'function') window.renderBooks();
    else if (typeof window.loadBooks === 'function') window.loadBooks();
  }

  syncLoginState();

  return {
    currentUser,
    syncLoginState,
    requireAuth,
    logout,
    get,
    set,
    getBooks,
    saveBooks,
    nextId,
    getIssues,
    saveIssues,
    getFiles,
    saveFiles,
    getNotices,
    saveNotices,
    getNoticesAsXML,
    getFeedback,
    saveFeedback,
    getAccounts,
    formatDate,
    today,
    addDays,
    isOverdue,
    escHtml,
    readFileAsBase64,
    showAlert,
    openModal,
    closeModal,
    addBook,
    loginAccount,
    registerAccount,
    fetchBooks,
    fetchBookById,
    createBook,
    updateBook,
    deleteBook,
    fetchIssues,
    issueBook,
    returnIssue,
    fetchFiles,
    uploadFile,
    deleteFile,
    fetchNotices,
    createNotice,
    deleteNotice,
    fetchFeedback,
    sendFeedback,
    fetchUsers,
    syncData,
    ready,
  };
})();

