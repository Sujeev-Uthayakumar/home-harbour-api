class Review {
  constructor(data) {
    this.id = data.id;
    this.reviewerID = data.reviewerID;
    this.homeID = data.homeID;
    this.rating = data.rating;
    this.comment = data.comment;
    this.date = data.date;
  }
}

module.exports = Review;
