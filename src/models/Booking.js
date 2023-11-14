class Booking {
  constructor(data) {
    this.id = data.id;
    this.ownerID = data.ownerID;
    this.renterID = data.renterID;
    this.title = data.title;
    this.description = data.description;
    this.type = data.type;
    this.maxGuests = data.maxGuests;
    this.amenties = data.amenties;
    this.photos = data.photos;
    this.price = data.price;
    this.availability = data.availability;
  }
}

export default Booking;

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
