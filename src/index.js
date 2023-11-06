import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getData } from './api'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a')
let page = 1;
let value = '';
formEl.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
    evt.preventDefault();
    value = evt.target.elements.searchQuery.value.trim();
    if (!value) return;
    page = 1;
    //console.log(value)
    try {
        const { totalHits, hits } = await getData(value, page);
        
        //console.log(hits.length)
        if (!hits.length) {
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        Notify.info(`Hooray! We found ${totalHits} images.`);
        clearGallery();
        if (totalHits <= 40) {
            loadMoreEl.classList.add(`is-hidden`);
        } else {
            loadMoreEl.classList.remove(`is-hidden`);
        }
        const markup = createGallery(hits);
        addMarkup(markup);
        lightbox.refresh();
        //scrollPage();
    } catch (error) {
        onError()
    } finally {
        evt.target.reset();
    }
    
}

function createGallery(items = []) {
    return items.map(({webformatURL,largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<a href='${largeImageURL}'>
     <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${downloads}
    </p>
  </div>
</div></a>
     `
    }).join('')
 }


function addMarkup(markup = '') {
    galleryEl.insertAdjacentHTML('beforeend', markup)
}


function clearGallery() {
    galleryEl.innerHTML = ''; 
}

loadMoreEl.addEventListener('click', onClick)

async function onClick() {
    try {
        page += 1;
        const { totalHits, hits } = await getData(value, page);
        const markup = createGallery(hits);
        addMarkup(markup)
        lightbox.refresh();
        scrollPage();
        if (page * 40 >= totalHits) {
            loadMoreEl.classList.add('is-hidden');
            Notify.info(`We're sorry, but you've reached the end of search results.`);
        }
    } catch (error) {
        onError()
    }
}

function onError() {
    Notify.warning('Oops! Something went wrong');
}

function scrollPage() {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}