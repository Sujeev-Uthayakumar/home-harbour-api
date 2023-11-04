class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.profilePic = data.profilePic;
    this.birthDate = data.birthDate;
    this.phoneNumber = data.phoneNumber;
  }
}

module.exports = User;
