class Home {
  constructor(
    title,
    description,
    address,
    street,
    city,
    province,
    postal,
    country,
    type,
    bedrooms,
    bathrooms,
    maxGuests,
    amenties,
    photos,
    price,
    availability,
    owner,
    rating,
    reviews
  ) {
    this.title = title;
    this.description = description;
    this.address = address;
    this.street = street;
    this.city = city;
    this.province = province;
    this.postal = postal;
    this.country = country;
    this.type = type;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.maxGuests = maxGuests;
    this.amenties = amenties;
    this.photos = photos;
    this.price = price;
    this.availability = availability;
    this.owner = owner;
    this.rating = rating;
    this.reviews = reviews;
  }
}

export default Home;

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
