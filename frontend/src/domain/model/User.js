class User {
  constructor(username, password, id = null) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}

export default User;
