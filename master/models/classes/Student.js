module.exports = class Student {

  constructor(userId,first_name,last_name,school,email,password,img,theme,handle, mySchedule, status, subscription, creditHours, threads, major, bio) {
    this.userId = userId;
    this.first_name = first_name;
    this.last_name = last_name;
    this.school = school;
    this.email = email;
    this.password = password;
    this.image = img;
    this.theme =theme;
    this.handle = handle;
    this.mySchedule = mySchedule;
    this.status = status;
    this.subscription = subscription;
    this.creditHours = creditHours;
    this.threads = threads;
    this.Major = major;
    this.Bio = bio;
  }
  //return userID
  getId(){
    return this.userId;
  }
  //return user name
  getName(){
    return this.first_name + " " + this.last_name;
  }
  //return handle
  getHandle(){
    return this.handle;
  }
  //return school
  getSchool(){
    return this.school;
  }
  //return email
  getEmail(){
    return this.email;
  }
  //return password
  getPassword(){
    return this.password;
  }
  //return img
  getImg(){
    return this.image;
  }
  getStatus(){
    return this.status;
  }
  getSubscription(){
    return this.subscription;
  }
  getThreads(){
    return this.threads;
  }
  getCreditHours(){
    return this.creditHours;
  }
  //return theme
  getTheme(){
    return this.theme;
  }
  //return schedule
  getMySchedule(){
    return this.mySchedule;
  }
  //return major
  getMajor(){
    return this.major;
  }
  }
  