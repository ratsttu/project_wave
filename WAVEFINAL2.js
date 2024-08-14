let Sending = ['SU']; // Start up (SU) is the restarting code section... (EN) For Ending
let blockBellows =[];
let Groups = [];
let Raduis = 15;


//Counting for the clones...
let rightDC = 1;
let leftDC = 1;
let DC = 1;
let Armup = 1;
let Armdown = 1;
let Wait = 1;
let Loop = 1;

//Mouse position varibles..
let x=0;
let y=0;
let click=false;
let areaWidth = 1000; // just in case of the areawidth and height freaking out and doesn't instantiate it...
let areaHeight = 1000;

//Holder for which thing is being moved...
let idOn=0;
let numOn=0;
let message;
let Classes;

//re-moving the peices...
function MovingAgain(Handler){
    let Splitting = $(Handler).attr('id').split('X'); //takes the id of the handler and splits the id up again to re-add them into idOn and numOn.
    idOn = Splitting[0];
    numOn = Splitting[1];
    message  = $(Handler).html();
    Classes =  $(Handler).attr('class');
    $(Handler).remove(); //removes the permanent version
    $("#CodingArea").append("<div class = "+Classes+" id = '"+idOn+"X"+numOn+"'>"+message+"</div>"); // re-adds the temp version again
} 
//Sending to server
function send(){
    alert("sending");
    Sending[Sending.length()]='EN';
}


$(document).ready(function() { //checks to see if the document is ready...
    
    //MOuse moving tracker...
    $("#CodingArea")
    .on("mousemove",function(event){
        //Finding the mouses position on the page
        areaWidth = $(this).width();
        areaHeight = $(this).height();
        x = (event.pageX - $(this).offset().left) / areaWidth * 100;
        y = (event.pageY - $(this).offset().top) / areaHeight * 100;
        if(idOn!=0){
            var stringing =  "" + idOn + "X" + numOn + "" // Unique Id maker
            if(click){
                let yS = y+  "%";
                let xS = (x-2) + "%";
                $("#"+stringing).css("top",yS);
                $("#"+stringing).css("left",xS);//while holding click, follow the mouse
            }else{
                $("#"+idOn+"X"+numOn+"").remove();//once not clicking, remove the temp class, and create a new one
                if (x>30){ 
                    Creating(Classes, stringing, message,x,y);
                    ClickingCheck(stringing); // Checking if its close to anything
                }
                idOn=0;// resetting the unique Id maker
                numOn=0;
            }
        }
    })
    .on("mousedown",function(){ //checks to see if there is a mouse down event happening on the body
        click=true;
    })
    .on("mouseup",function(){ // checks to see if there is a mouse up event happening on the body
        click = false;
    })
    .on("onkeypress",function(event){
        var key = event.key; //Broken, don't worry about
        if(key == "Enter"){
            Send();
        }
    });
    

    //cloning functions
    $(".Motor").on("mousedown", function(){
        idOn = $(this).attr('id'); // grabs whatever id has been pressed from the class of Motor
        message = $(this).html(); //grabs its inside html of the clicked motor thing
        Classes= "Copy_Motor"; //sets the class...
        if(idOn == "dc"){ //checks the id, and see if it matches the inside part... then gets an id specific unique number and increases it afterwards
            numOn=DC;
            DC++;
        }else if(idOn == "dcr"){
            numOn=rightDC;
            rightDC++;
        }else if(idOn == "dcl"){
            numOn=leftDC;
            leftDC++;
        }else if(idOn == "armup"){
            numOn=Armup;
            Armup++;
        }else if(idOn == "armdown"){
            numOn=Armdown;
            Armdown++;
        }else{
            alert("Error: unidentified ID for Copy: MOTOR!"); //if somehow there is a random id, this just displays an error message
        }
        $("#CodingArea").append("<div class = "+Classes+" id = '"+idOn+"X"+numOn+"'>"+message+"</div>"); //creates a temp block
    });
    $(".control").on("mousedown", function(){ //Similar to the above copying function
        idOn = $(this).attr('id');
        message = $(this).html();
        Classes= "Copy_control";
        if(idOn == "wait"){
            numOn=Wait;
            Wait++;
        }else if(idOn == "loop"){
            numOn=Loop;
            Loop++;
        }else{
            alert("Error: unidentified ID for Copy: CONTROL!")
        }
        $("#CodingArea").append("<div class = "+Classes+" id = '"+idOn+"X"+numOn+"'>"+message+"</div>");
    });
    // form changes...
    $('.NumberInput').keypress(function(event){ //still broken
        let key = event.key;
        console.log($(this).parent().parent().attr('id'));
    });


    //Removes the tutorial window, and makes it dissappear
    $("#TutorialClose").on("click",function(){
        $(".tutorial-box").css("opacity",0.0);
        $(".tutorial-box").css("z-index",0);
        $(".tutorial-box").css("width",0);
        $(".tutorial-box").css("height",0);
        $(".tutorial-box").css("position","relative");
        $(".tutorial-box").css("border","none");
    });
});

//Function that takes in a data list, then keeps the unique elements, and only keeps the last of any duplicated elements...
function removeDuplicates(data) {
    let unique = [];
    for (let i = 0; i < data.length; i += 2) {
        let loc = data.lastIndexOf(data[i]);
        if(loc == i){
            unique.push(data[loc]);
            unique.push(data[loc+1]);
        }
    }
    return unique;
}
//This is to check if it can be put into a group...
function ClickingCheck(id){
    //Grabbing the blockBellow stuff and looking for the id location and grabbing its x and y values
    let blockLoc = blockBellows.indexOf(id);
    let Loc = blockBellows[blockLoc+1].split(',');
    let x = Loc[0];
    let y = Loc[1];
    //checking for close things to connect
    let connection = false;
    let top;
    for(let i = 0; i<blockBellows.length-2; i+=2){
        let TopLoc = blockBellows[i+1].split(',');
        console.log(TopLoc);
        let Topx = TopLoc[0];
        let Topy = TopLoc[1];
        
        console.log("Y axis:"+(((y+Raduis)>Topy)&&((y-Raduis)<Topy)));
        console.log("x Axis:"+(((x+Raduis)>Topx)&&((x-Raduis)<Topx)));
        console.log(""+x+" "+y+" "+Topx+" "+Topy+"");        
        if(((((x+Raduis)>Topx)&&((x-Raduis)<Topx))&&(((y+Raduis)>Topy)&&((y-Raduis)<Topy)))&&(!connection)){
            connection = true;
            top = blockBellows[i];
            console.log("CheckTrue");
        }
    }
    if(connection && (id!=top)){
        if((GroupCheck(id))^(GroupCheck(Top))){
            if(Group.indexOf(id)!=-1){
                let loc = Groups.indexOf(id);
                Groups[loc] = top+","+Groups[loc];
            }else{
                let loc = Groups.indexOf(top);
                Groups[loc] = Groups[loc]+","+id;
            }
        }else if((GroupCheck(id)) && (GroupCheck(Top))){
            let WhereId = GroupCheck(id,Groups);
            let WhereTop = GroupCheck(top,Groups);
            if(Topy > y){
                Groups[WhereTop].concat(Groups[WhereId]);
                Groups.splice(WhereId,1);
            }else{
                Groups[WhereId].concat(Groups[WhereTop]);
                Groups.splice(WhereTop,1);
            }
        }else{
            Groups.push(top+","+id);
        }
    }
    console.log(Groups);
    
}

// Function to check if an id is inside the groups array, group list, which has elements in the form of ['dcx1,dcx2','dclx1, dcrx1'], which removes the ability to use include...
function GroupCheck(id){
    let check = false;
    Groups.forEach(Element => function(){
        if(Element.contains(id)){
            check = true;
        }
    });
    return check;
}
//This is a function to grab where in the list a specific id is...
function GroupCheck(id,List){
    let Where;
    List.forEach(Element => function(){
        if(Element.contains(id)){
            Where = List.indexOf(Element);
        }
    });
    return Where;
}

// Moved the groups into the corrected positions based on the list...
function moving(){
    for(let i = 0; i<Groups.length;i++){
        let list = Group[i].split(','); // splits the group individual elements
        let Loc = blockBellows.indexOf(list[0]); // finds the element in the block grand list
        let Cord = blockBellows[Loc+1].split(","); // grabs the second element after the found element index
        for(let j = 0; j < list.length;j++){ //repeats throughout the whole split element list
            $("#"+list[j]+"").css("top",(Cord[1]+(i*50))); //takes the element, and moves it down based on the corridents
            $("#"+list[j]+"").css("left",Cord[0]);
        }
    }
}


//creates the static blocks...
function Creating (Classes,id,message,x,y){
    let Xfixed = (x-33.3)*10/7; // takes the conversion
    let XfixedS = ""+Xfixed+"%"; //puts it into precentage based
    let yS = ""+(y-.51)+"%"; //makes it into a precentage based
    $("#CreativeSpace").append("<div class = "+Classes+" id = '"+id+"' onmousedown='MovingAgain("+id+")'>"+message+"</div>"); // makes the more permanent version
    $("#"+id+"").css("top",yS); //gives the id the precentage based x,y
    $("#"+id+"").css("left",XfixedS);
    blockBellows.push(id); //adds the id to the list of blocks
    blockBellows.push(""+x+","+y+""); // adds its x,y to the thing
    blockBellows=removeDuplicates(blockBellows); //removes all the duplicants
}


//wip
function send(){
    Sending.push('SU');
    let Looplist = [];
    let looping = false;
    let LoopingGo = false;
    let loopingStart = 0;
    let loopingEnd = 0;
    let loopamount = 0;
    Groups.forEach(Element => function(){
        let split = Element.split('X');
        switch(split[0]){
            case "dc":
                Sending.push('DC');
                if(looping){
                    Looplist.push(Element);
                }
                break;
            case "dcr":
                Sending.push('DCR');
                if(looping){
                    Looplist.push(Element);
                }
                break;
            case "dcl":
                Sending.push('DCL');
                if(looping){
                    Looplist.push(Element);
                }
                break;
            case "Armup":
                Sending.push("AU");
                if(looping){
                    Looplist.push(Element);
                }
                break;
            case "ArmDown":
                Sending.push("AD");
                if(looping){
                    Looplist.push(Element);
                }
                break;
            case "Wait":
                Sending.push("W");
                if(looping){
                    Looplist.push(Element);
                }
                break;
            case "Loop":
                looping = true;
                loopingStart = Groups.indexOf(Element);
                break;
            case "LoopE":
                loopingEnd = Groups.indexOf(Element);
                LoopingGo = true;
                break;
        }
        

    });
    

}