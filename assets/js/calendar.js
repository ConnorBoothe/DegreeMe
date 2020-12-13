$(function() {
    var calendarEvents = [];


    // page is now ready

    function refreshData(data, callback){
        data.map(function(e){
            var endtemp = new Date(e.date);
            
            endtemp.setTime(endtemp.getTime()+(e._doc.duration*1000*60*60));
            console.log(endtemp);
            var end = moment.utc(endtemp, "yyyy-MM-ddTHH:mm:ss")._i;
            console.log(end);
            var EventObj = {
                id: e._doc._id,
                title: e._doc.title,
                description: e._doc.description,
                start: e.date,
                end: end,
                duration: e._doc.duration,
                type: e._doc.type,
                url: e._doc.streamId,
                location: e._doc.location
            }
    
            calendarEvents.push(EventObj);
        })
        callback();
}
    function fetchAndRerender(modal){
        calendarEvents = [];
        $('#calendar').fullCalendar('removeEvents');
   
        $.getJSON("/calendar/getEvents", function(data){
            
             refreshData(data, function(){
                console.log(calendarEvents);
                $("#calendar").fullCalendar('addEventSource', calendarEvents);
                $(modal).modal('toggle');
                $('#calendar').fullCalendar('rerenderEvents');
                
             })
            
                
      
})
     
    }

           
   
    //as the name suggests this is the function we're going to use to show the edit form in a modal
    function showEditForm(event, jsEvent, view){
                 
            $('#modalTitle').html(event.title);
            $('#modalBody').html(`
            <form id="editEvent" class="form-control">
            <fieldset id="fieldset" disabled>
            <label for="title">Title</label>
            <input class="form-control" name="title" type="text" value="`+event.title+`" required/>
            <label for="description">Description</label>
            <input class="form-control" name="description" type="textarea" value="`+event.description+`" />
            <label for="stream">Stream link</label>
            <input class="form-control" name="stream" type="text" value="`+event.url+`"/>
            <label for="location">Location</label>
            <input class="form-control" name="location" type="text" value="`+event.location+`"/>
            <label for="start">Start</label>
            <input class="form-control" name="start" type="datetime-local" value="`+moment.utc(event.start, "yyyy-MM-ddTHH:mm:ss")._i+`" required/> 
            <label for="duration">Duration</label>
            <input class="form-control" name="duration" type="number" step="0.1" value="`+event.duration+`" required/>
            <label for="type">Type</label>
            <select id="select-type" class="form-control" name="type" required>
                <option value="tutoring">tutoring</option>
                <option value="group session">group session</option>
                <option value="meetup">meetup</option>
                <option value="appointment">appointment</option>
            </select>
            <input type="hidden" name="id" value="`+event.id+`" />
            <input id="update-button" class="form-control btn-success" type="hidden" value="Update" />
            </fieldset>
            </form>
          `);
            $('#select-type option[value="'+event.type+'"]').attr('selected','selected');
            if(event.url){
              
                $('#modal-footer').html(`  <div class="row">
                <div class="col-md-12 text-center">
                <div class="btn-group btn-group-md" role="group">
                <button id="deleteEvent" class="btn btn-danger ">Delete</button>
                <button id="enableEditEvent" class="btn btn-secondary" >Edit</button>
                </div>
                </div>
                </div><a href="/stream/`+event.url+`" class="btn btn-secondary" id="eventUrl" target="_blank" >Go to stream</a><button type="button" class="btn btn-light" data-dismiss="modal">Close</button>`)
            
            }
            else if(event.location){
                $('#modal-footer').html(`  <div class="row">
                <div class="col-md-12 text-center">
                <div class="btn-group btn-group-md" role="group">
                <button id="deleteEvent" class="btn btn-danger ">Delete</button>
                <button id="enableEditEvent" class="btn btn-secondary" >Edit</button>
                </div>
                </div>
                </div><a href="`+event.location+`" class="btn btn-secondary" id="eventUrl" target="_blank" >Go to location</a><button type="button" class="btn btn-light" data-dismiss="modal">Close</button>`)
            
            }else{
                $('#modal-footer').html(`  <div class="row">
                <div class="col-md-12 text-center">
                <div class="btn-group btn-group-md" role="group">
                <button id="deleteEvent" class="btn btn-danger ">Delete</button>
                <button id="enableEditEvent" class="btn btn-secondary" >Edit</button>
                </div>
                </div>
                </div><button type="button" class="btn btn-light" data-dismiss="modal">Close</button>`)
            
            }
       
            $('#fullCalModal').modal();
            return false;
                
}

//this is for enabling edit
    $(document).on("click","#enableEditEvent", function(e){
            $("#enableEditEvent").hide();
            $("#fieldset").removeAttr("disabled");
            $("#update-button").attr("type","submit");
            $("#editEvent input,#editEvent select").not($("#update-button")).css("background","white");
            $("#editEvent input,#editEvent select").not($("#update-button")).css("color","black");
    })
//this is for coloring the events based on type
    function eventColorCode( event, element, view ) { 
                    if (event.type == "tutoring") {
                        //apply your logic here, make changes to element.
                        element.css('background', '#443afc');
                        element.css('border', 'none');
                        element.css('font-weight', '400');
                    }
                    if(event.type == "group session"){
                        element.css("background", "#17A2B8");
                        element.css('border', 'none');
                        element.css('font-weight', '400');
                    }
                    if(event.type == "appointment"){
                        element.css("background", "#C8639E");
                        element.css('border', 'none');
                        element.css('font-weight', '400');
                    }
                    if(event.type == "meetup"){
                        element.css("background", "#007BFF");
                        element.css('border', 'none');
                        element.css('font-weight', '400');
                    }
    }
    //this is for rendering the title which is at the top of the calendar
    function renderTitle(view, element) {
                //The title isn't rendered until after this callback, so we need to use a timeout.
                if(view.type === "month"){
                    window.setTimeout(function(){
                        $('.fc-toolbar .fc-center h2').empty().append(
                            "<div>"+view.title+"</div>"
                        );
                    },0);
                }
                if(view.type === "agendaDay"){
                    window.setTimeout(function(){
                        $('.fc-toolbar .fc-center h2').empty().append(
                            "<div>"+view.title+"</div>"
                        );
                    },0);
                }
                if(view.type === "agendaWeek"){
                    window.setTimeout(function(){
                        $('.fc-toolbar .fc-center h2').empty().append(
                            "<div>"+view.title+"</div>"
                        );
                    },0);
                }
    }


//this is to handle the onClick of the previous button
    $('.fc-prev-button').click(function() {
        $('#calendar').fullCalendar('prev');
    });


//this is to handle the onClick of the next button
      $('.fc-next-button').click(function() {
        $('#calendar').fullCalendar('next');
    });


//this is to handle the onClick of the today button
      $('.fc-today-button').click(function() {
        $('#calendar').fullCalendar('today');
    });


    
//this is to handle the onClick of the dropdown and changing the view to either month, day or week
      $("#my-select").on("change",(function(e){
        $('#calendar').fullCalendar('changeView', 
          this.options[e.target.selectedIndex].value);
    }))
    

//this is to handle the onClik of the + button to add an event
    $("#addEventButton").click(function(e){
      $('#addEventTitle').html("Add an event");
                        $('#addEventBody').html(`
                        <form id="addEvent" class="form-control">
                        <label for="title">Title</label>
                        <input class="form-control" name="title" type="text" required/>
                        <label for="description">Description</label>
                        <input class="form-control" name="description" type="textarea" />
                        <label for="stream">Stream link</label>
                        <input class="form-control" name="stream" type="text" />
                        <label for="location">Location</label>
                        <input class="form-control" name="location" type="text" />
                        <label for="start">Start</label>
                        <input class="form-control" name="start" type="datetime-local" required/>
                        <label for="duration">Duration</label>
                        <input class="form-control" name="duration" min="0" max="24" type="number" step="0.1"  required/>
                        <label for="type">Type</label>
                        <select class="form-control" name="type" required>
                        <option value="tutoring">tutoring</option>
                        <option value="group session">group session</option>
                        <option value="meetup">meetup</option>
                        <option value="appointment">appointment</option>
                        </select>
                        <input id="addEventSubmit" class="form-control btn-secondary" type="submit" value="Add event" />
                        </form>`);
                        $('#addEventModal').modal();
    })
       //this is what we're going to use to send the event data to the server for adding an event
    $(document).on("submit","#addEvent",(function(e){
        e.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
        url:"/calendar/addEvent",
        method: "POST",
        dataType: "json",
        data: formData,
        success: function(result){
            alert("event added successfully!");
            fetchAndRerender('#addEventModal')
        },
        error:function(xhr, resp, text){
            console.log(xhr, resp, text);
        },

              })
    }))
     //this is what we're going to use to send the event data to the server for editing an event
    $(document).on("submit","#editEvent",(function(e){
        e.preventDefault();
        var formData = $(this).serialize();
            $.ajax({
                url:"/calendar/updateEvent",
                method: "POST",
                dataType: "json",
                data: formData,
                success: function(result){
                    alert(result.message);
                    fetchAndRerender('#fullCalModal');
                },
                error:function(xhr, resp, text){
                    console.log(xhr, resp, text);
                },

                  })
                                    }))
     //this is what we're going to use to send the event data to the server for deleting an event
    $(document).on('click',"#deleteEvent",(function(e){
        e.preventDefault();
        if (confirm('Are you sure you want to delete this event?')) {
            $("#fieldset").removeAttr("disabled");
        var formData = $("#editEvent").serialize();
        console.log(formData);

            $.ajax({
              url:"/calendar/removeEvent",
              method: "DELETE",
              dataType: "json",
              data: formData,
              success: function(result){
                  alert(result.message);
                  fetchAndRerender('#fullCalModal');
              },
              error:function(xhr, resp, text){
                console.log(xhr, resp, text);
              },
       
                   })
                                                                    } 
        else {
        // Do nothing!
            return;
             }
        
                                    }))
           //commented below is the method we're going to call the server with to supply us with the events
$.getJSON("/calendar/getEvents", function(data){
    data.map(function(e){
        var endtemp = new Date(e.date);
        
        endtemp.setTime(endtemp.getTime()+(e._doc.duration*1000*60*60));
        console.log(endtemp);
        var end = moment.utc(endtemp, "yyyy-MM-ddTHH:mm:ss")._i;
        console.log(end);
        var EventObj = {
            id: e._doc._id,
            title: e._doc.title,
            description: e._doc.description,
            start: e.date,
            end: end,
            duration: e._doc.duration,
            type: e._doc.type,
            url: e._doc.streamId,
            location: e._doc.location
        }

        calendarEvents.push(EventObj);
    })
    
//this is for initializing the calendar
$('#calendar').fullCalendar({
    // put your options and callbacks here
              selectable: true,
              themeSystem:"standard",
              header: false,
              defaultDate: moment(),
              defaultView: 'month',
              height:"parent",
              allDaySlot: false,
              viewRender:renderTitle ,
              eventRender:eventColorCode ,
              eventClick: showEditForm,
              events: calendarEvents
  })
})

    


});