module.exports = class Connection {
//this class represents a connection between a student and a tutoring session
  constructor(id,sessionID,tutor,student,className, courseCode, date,time, building, room, hourlyRate,hours, studentsAttending, type,leftReview,  sessionNotes ) {
    this.connectionID=id;
    this.sessionID = sessionID;
    this.tutor = tutor;
    this.student = student;
    this.className = className;
    this.courseCode = courseCode;
    this.date = date;
    this.time = time;
    this.building = building;
    this.room = room;
    this.hourlyRate = hourlyRate;
    this.hours = hours;
    this.studentsAttending = studentsAttending;
    this.type = type;
    this.sessionNotes = sessionNotes;
    this.leftReview = leftReview;
  }
    //return ID
    //return tutor
    getTutor(){
      return this.tutor;
    }
    getImg(){
      return this.img;
    }
    //return student
    getStudent(){
      return this.student;
    }
    //return class name
    getclassName(){
      return this.className;
    }
    //return class course code
    getCourseCode(){
      return this.courseCode;
    }
    //return date
    getDate(){
      return this.date;
    }
    //return time
    getTime(){
      return this.time;
    }
    //return location
    getBuilding(){
        return this.building;
    }
    getRoom(){
      return this.room;
  }
  getHourlyRate(){
    return this.hourlyRate;
}
getStudentsAttending(){
  return this.studentsAttending;
}
getType(){
  return this.type;
}
getSessionNotes(){
  return this.sessionNotes;
}
getSessionID(){
  return this.sessionID;
}
}
  