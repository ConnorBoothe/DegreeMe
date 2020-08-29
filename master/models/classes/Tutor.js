
//var connections = u.getAllConnections();

module.exports = class Tutor {

  constructor(id,UserID, Handle, Name, Subject, Grade, HourlyRate, NumHours, School, Type, Schedule, MaxStudents, StudentsAttending, img, Virtual, CourseCode) {
    this.id = id;
    this.UserID = UserID;
    this.Name = Name;
    this.Handle = Handle;
    this.Subject = Subject;
    this.Grade = Grade;
    this.HourlyRate = HourlyRate;
    this.NumHours = NumHours;
    this.School = School;
    this.Type = Type;
    this.Schedule = Schedule;
    this.MaxStudents = MaxStudents;
    this.StudentsAttending = StudentsAttending;
    this.img = img;
    this.Virtual = Virtual;
    this.CourseCode = CourseCode;

  }
  //compute average tutor rating and return it along with review count
  getAvgRating(reviews){
    var count = 0;
    var ratingTotal = 0;
    for(x in reviews){
        ratingTotal += parseInt(reviews[x].Rating);
        count++;
    }
    return [ratingTotal/count, count];
  }
  //return ID
  getUserID(){
    return this.UserID;
  }
  //return tutor
  getName(){
    return this.Name;
  }
  getHandle(){
    return this.Handle;
  }
  //return subject
  getSubject(){
    return this.Subject;
  }
   //return grade
   getGrade(){
    return this.Grade;
  }
   //return hourly rate
   getHourlyRate(){
    return this.HourlyRate;
  }
   //return hourly rate
   getNumHours(){
    return this.NumHours;
  }
  //return school
  getSchool(){
    return this.School;
  }
  //return type
  getType(){
    return this.Type;
  }
  //return time
  getTime(){
    return this.Time;
  }
  //return date
  getDate(){
      return this.Date;
  }
  //return date
  getMinStudents(){
    return this.MinStudents;
  }
  getMaxStudents(){
    return this.MaxStudents;
  }
  getBuilding(){
    return this.Building;
  }
  getRoom(){
    return this.Room;
  }
  getStudentsAttending(){
    return this.StudentsAttending;
  }
  incrementStudentsAttending(){
    this.studentsAttending++;
  }
  getImg(){
    return this.img;
  }
  getRating(){
    return this.Rating;
  }
}
  