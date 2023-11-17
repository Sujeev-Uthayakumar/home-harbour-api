class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.fullName = data.fullName;
    this.profilePic = data.profilePic;
    this.birthDate = data.birthDate;
    this.phoneNumber = data.phoneNumber;
  }
}

module.exports = User;
