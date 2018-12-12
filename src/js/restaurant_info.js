let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiaW0tdmlnbmVzaCIsImEiOiJjam5zaW96M2owaHcyM3BwanJoeHF5MHo0In0.-Wxfe8IHwdjP27ookoZcag',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      createFormHTML();
      fillMetaDesc();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.setAttribute('aria-label','restaurant name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.setAttribute('aria-label','restaurant address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.name;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.setAttribute('aria-label','cuisine type');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('th');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  title.setAttribute('id','reviews-header');
  container.appendChild(title);

  const id = getParameterByName('id');
  DBReviews.fetchReviewsByRestaurant(id, (error, reviews) => {
    self.reviews = reviews;
    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    } 
    reviews.forEach(review => {
      ul.appendChild(createReviewHTML(review));
    });
  });
  const ul = document.getElementById('reviews-list');
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.setAttribute('tabindex','0');
  
  const art = document.createElement('article');
  art.setAttribute('role','article');
  art.setAttribute('aria-label','review by '+review.name);
  li.append(art);

  const rev = document.createElement('div');
  rev.className = 'review-title';
  art.appendChild(rev);

  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.className = 'reviewer';
  art.setAttribute('aria-label','reviewer');
  rev.appendChild(name);

  const date = document.createElement('p');
  // date.innerHTML = review.date;
  date.innerHTML = new Date(review.updatedAt).toDateString();
  date.className = 'reviewDate';
  date.setAttribute('aria-label','review date');
  rev.appendChild(date);

  const ratingDiv = document.createElement('div');
  ratingDiv.className = 'rating';
  art.appendChild(ratingDiv);

  const rating = document.createElement('p');
  rating.className = 'ratings';
  rating.setAttribute('aria-label','rating');
  rating.innerHTML = `Rating: ${review.rating}`;
  ratingDiv.appendChild(rating);

  const comments = document.createElement('p');
  comments.className = 'comments';
  comments.innerHTML = review.comments;
  comments.setAttribute('aria-label','comment');
  art.appendChild(comments);

  return li;
}

/**
 * Create form HTML and add it to the webpage.
 */
createFormHTML = () => {
  const formContainer = document.getElementById('form-container');
  const title = document.getElementById('form-title');
  title.innerHTML = 'Write a Review';
  formContainer.append(title);

  const form = document.getElementById('review-form');
  // form.setAttribute('method', 'post');
  formContainer.append(form);

  const ratingLabel = document.createElement('label');
  ratingLabel.setAttribute('for','input-rating');
  ratingLabel.innerHTML = 'Select Rating';
  ratingLabel.className = 'form-label';
  form.append(ratingLabel);

  form.append(createRatingOptions());
  
  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for','input-name');
  nameLabel.innerHTML = 'Name';
  nameLabel.className = 'form-label';
  form.append(nameLabel);

  const nameText = document.createElement('input');
  nameText.className = 'form-input';
  nameText.setAttribute('name', 'name');
  nameText.setAttribute('id','input-name');
  nameText.setAttribute('type','text');
  form.append(nameText);

  const reviewLabel = document.createElement('label');
  reviewLabel.setAttribute('for','input-review');
  reviewLabel.innerHTML = 'Review';
  reviewLabel.className = 'form-label';
  form.append(reviewLabel);

  const reviewText = document.createElement('textarea');
  reviewText.className = 'form-input';
  reviewText.setAttribute('name', 'comments');
  reviewText.setAttribute('id','input-review');
  form.append(reviewText);

  const submitButton = document.createElement('input');
  submitButton.setAttribute('id','submit-button');
  submitButton.setAttribute('type','submit');
  form.append(submitButton);

  return formContainer;
}

createRatingOptions = () => {
  let i;
  const ratingSelect = document.createElement('select');
  ratingSelect.className = 'form-input';
  ratingSelect.setAttribute('name', 'rating');
  ratingSelect.setAttribute('id','input-rating');

  for (i = 0; i < 5; i++) {
    let ratingOptions = document.createElement('option');
    ratingOptions.setAttribute('value', i+1);
    ratingOptions.innerHTML = i+1;
    ratingSelect.append(ratingOptions);
  }

  return ratingSelect;
}


const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', event => {
  event.preventDefault()
  let review = {'restaurant_id': self.restaurant.id};
  let data = new FormData(reviewForm);  // get values from form
  for(var [key, value] of data.entries()) {
    review[key] = value;  // save form values to review
  }
  DBReviews.submitReviews(review)
    .then(data => {
      // append comment to page and reset form
      const ul = document.getElementById('reviews-list');
      review.createdAt = + new Date();
      review.updatedAt = + new Date();
      ul.appendChild(createReviewHTML(review));
      reviewForm.reset();
    })
    .catch( error => {
      console.log(error);
    })
})

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  const link = document.createElement('a');
  link.setAttribute('aria-current','page');
  link.href = '#';
  link.innerHTML = restaurant.name;
  li.append(link);
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

fillMetaDesc = (restaurant = self.restaurant) => {
  document.querySelector('meta[name=description]').setAttribute("content","Review of " +restaurant.name);
}
