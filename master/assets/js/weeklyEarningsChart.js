//Functions used to display data on the MyFinances Page

//This function takes the current day as an input and returns a sorted array of days of the week
function sortDays(currentDay){
    var daysOfWeek = ["Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var dayArray= new Array;
    for(var x = 0; x < daysOfWeek.length; x++){
        //push days to dayArray beginning with current, then next etc. Use modulus operator to handle array overflow.
        dayArray.push(daysOfWeek[((parseInt(currentDay+1)+x)-1)%7])
    }
    return dayArray;
}
//This function takes the current day as an input and returns a sorted array of days of the week
function sortMonths(currentMonth){
    var months = ["Jan","Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept","Oct","Nov","Dec"];
    var sortedMonths= new Array;
    for(var x = 0; x < months.length; x++){
        //push months to sortedMonth beginning with current, then next etc. Use modulus operator to handle array overflow.
        sortedMonths.push(months[((parseInt(currentMonth+1)+x))%12])
    }
    return sortedMonths;
}

//Toggles appropriate chart when chart button is clicked
function showGraph(chartButtons, graphs){
    $(chartButtons).eq(0).css("background-color","rgba(54, 162, 235, 1)");
    $("#myChartMonth").hide();
    $("#myChartYear").hide();
    $(chartButtons).on("click",function(){
        
        $(chartButtons).css("background-color","#343a40");
        $(this).css("background-color","rgba(54, 162, 235, 1)");
        if($(this).text() === "1W"){
            $("#myChart").show();
            $("#myChartMonth").hide();
            $("#myChartYear").hide();
            $(this).css("background-color","rgba(54, 162, 235, 1)");
        }
        
        else if($(this).text() === "1Y"){
            $("#myChart").hide();
            $("#myChartMonth").hide();
            $("#myChartYear").show();
            $(this).css("background-color","'rgba(255, 99, 132, 1)',");
        }
    })
}

$(document).ready(function(){
showGraph(".chartOptions li", "#chartDisplay");
var ctx = document.getElementById('myChart').getContext('2d');
var date = new Date();
var day = date.getDay();
var month = date.getMonth();





//1 week chart
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: sortDays(day),
        datasets: [{
            label: 'Revenue(USD)',
            data: [50, 20, 60, 10, 0, 30, 10],
            backgroundColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            color:'white',
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
   
    options: {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(255, 255, 255)',
               fontSize:16
            }
        },
        scales: {
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                },
                labels: {
                    fontColor: 'rgb(255, 99, 132)',
                   fontSize:20
                },
                ticks: {
                    beginAtZero: true,
                    fontColor: 'rgb(255, 255, 255)',
                    fontSize:16
                }
            }],
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                },
                ticks: {
                    beginAtZero: true,
                    fontColor: 'rgb(255, 255, 255)',
                    fontSize:16
                }

            }],
            
            
        }
    }
});

//1 year chart
var ctxYear = document.getElementById('myChartYear').getContext('2d');
var myChart = new Chart(ctxYear, {
    type: 'bar',
    data: {
        labels: sortMonths(month),
        datasets: [{
            label: 'Revenue(USD)',
            data: [50, 20, 30, 10, 0, 30, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            color:'white',
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
   
    options: {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(255, 255, 255)',
               fontSize:16
            }
        },
        scales: {
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                },
                labels: {
                    fontColor: 'rgb(255, 99, 132)',
                   fontSize:20
                },
                ticks: {
                    beginAtZero: true,
                    fontColor: 'rgb(255, 255, 255)',
                    fontSize:16
                }
            }],
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                },
                ticks: {
                    beginAtZero: true,
                    fontColor: 'rgb(255, 255, 255)',
                    fontSize:16
                }

            }],
            
            
        }
    }
});

});