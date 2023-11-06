import axios from 'axios'

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const getData = async (searchQuery, page = 1) => {
    try {
        const urlSeaParams = new URLSearchParams({
            key: '40514428-ea23f1f68b3df158899c4cf14',
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            q: searchQuery, 
            page,
            per_page: 40,
        });

        const response = await axios.get(`?${urlSeaParams}`);
        return response.data; 
    } catch (error) {
        Notify.warning('Oops! Something went wrong');
    }
};