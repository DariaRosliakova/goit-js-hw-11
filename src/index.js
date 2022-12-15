import './css/styles.css';
import axios from 'axios';
import SimpleLightbox from "simplelightbox"; 
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix, { Notify } from 'notiflix';



const form = document.querySelector('form');
const list = document.querySelector('.gallery');
const btn = document.querySelector('.load-more');

form.addEventListener('submit', onSubmit);
btn.addEventListener('click', onLoad);
btn.setAttribute('hidden', true);

let inputValue = '';
let page = 1;
let total = 0;
const simpleligthbox = new SimpleLightbox('.gallery a');   
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31850408-25581b481bc9bce110235587b';


async function fetchPics(inputValue, page = '1') {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
  const data = await response.data;    
  if (data.hits.length === 0 || !inputValue) {    
    throw new Error(Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'))
  }    
  return data;    
};

function onSubmit(e) {
  e.preventDefault();
  page = 1;
  total = 0;
  inputValue = e.currentTarget.elements.searchQuery.value.trim();    
  fetchPics(inputValue).then(data => {  
    total += data.hits.length;
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    list.innerHTML = '';    
    list.insertAdjacentHTML('beforeend', createList(data.hits));
    simpleligthbox.refresh()
    data.hits === data.totalHits ? btn.setAttribute('hidden', true) : btn.removeAttribute('hidden');
  }).catch(err => { btn.setAttribute('hidden', true); list.innerHTML = ''; console.log(err) });       
}

function createList(arr) {  
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
      <div class="thumb"><a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
  <div class="info">
    <p class="info-item">Likes 
      <b>${likes}</b>
    </p>
    <p class="info-item">Views
      <b> ${views}</b>
    </p>
    <p class="info-item">Comments 
      <b> ${comments}</b>
    </p>
    <p class="info-item">Downloads
      <b> ${downloads} </b>
    </p>
  </div>
</div>`
    ).join('');        
}

function scrollWindow() {
  const cardHeight = list.firstElementChild.getBoundingClientRect().height;  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function onLoad() {
  page += 1;
  fetchPics(inputValue, page).then(data => {
    total += data.hits.length; 
    if (total >= data.totalHits) {
      btn.setAttribute('hidden', true);
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
    }
    list.insertAdjacentHTML('beforeend', createList(data.hits));
      simpleligthbox.refresh()
      scrollWindow()
  }).catch(err => console.log(err))
    
}
