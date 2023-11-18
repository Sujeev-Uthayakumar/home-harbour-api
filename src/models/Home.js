class Home {
  constructor(data) {
    this.ownerID = data.ownerID;
    this.address = data.address;
    this.street = data.street;
    this.city = data.city;
    this.province = data.province;
    this.postal = data.postal;
    this.bedrooms = data.bedrooms;
    this.bathrooms = data.bathrooms;
    this.maxGuests = data.maxGuests;
    this.description = data.description;
    this.title = data.title;
    this.features = data.features;
    this.price = data.price;
  }
}

module.exports = Home;

// id: Unique identifier for the home (UUID for NoSQL or auto-incremented integer for SQL).
// title: A short, descriptive title of the rental property.
// description: A detailed description of the home.
// address: Full address of the property, which could be broken down into:
// street
// city
// state/province
// postal/zip code
// country
// type: Type of home (e.g., apartment, house, condo, townhouse).
// bedrooms: Number of bedrooms.
// bathrooms: Number of bathrooms, possibly split into full and half.
// max_guests: Maximum number of guests allowed.
// amenities: A list/array of amenities provided (e.g., Wi-Fi, air conditioning, pool).
// photos: URLs to images of the property, or references to image files.
// price_per_night: Price per night in the local currency.
// availability: A schedule/calendar of available dates for rent.
// owner: Reference to the user/owner who listed the property.
// rating: Average rating from reviews.
// reviews: A list of references to review objects/documents.
