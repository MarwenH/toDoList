


let tasks = document.getElementById("tasks")
let title = document.getElementById("title")
let description = document.getElementById("description")
let date = document.getElementById("date")

let inputTitle = document.getElementById("input-title")
let inputDescription = document.getElementById("input-description")
let inputDate = document.getElementById("input-date")

let msg = document.getElementById("msg")
let msg2 = document.getElementById("msg2")




// get item from Local Storage 

function getTaskFromLS(){
    let mydata = localStorage.getItem("mytasks");
    let retrievedTasks = JSON.parse(mydata);
    if (retrievedTasks == null)
    {
        taskdb = []
    }else
    {
        taskdb = retrievedTasks
    }
}



// read Data 

const readData = ()=>{
    i=0
    tasks.innerHTML =""
    for (const task of taskdb) {

        tasks.innerHTML += `
            <div id="${i}" class="${task.isdone ? 'task cheked'  : 'task'}">
                <div id="ctn">
                    <h4 id="title">${task.title}</h4>
                    <p id="description">${task.description}</p>
                    <p id="date"><i class="fa-sharp fa-solid fa-calendar-days"></i>${task.date}</p>
                </div>
                <div id="option">
                        <i class="fa-solid fa-pen-to-square" id="edit" onclick="editTask(${i})"></i>
                        ${
                            (task.isdone  ? `<i class="fa-solid fa-xmark cheked" onclick=checkTask(${i})></i>` : `<i class="fa-solid fa-check" onclick="checkTask(${i})"></i>` )
                        }
                        
                        <i class="fa-regular fa-trash-can" onclick="getdelindex(${i})" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                </div>
        </div>
            `
            i++        
    }
}

getTaskFromLS()

readData()





/** Date format to set it default (current date) if filed is empty **/

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};




//pop up 

function togglePopup(){
    document.getElementById("popup1").classList.toggle("active")

    // reset form 

    inputTitle.value = ""
    inputDescription.value = ""
    inputDate.value = ""
    document.getElementById("notyet").checked = true

    msg.innerHTML = ""
    msg2.innerHTML = ""
    
    resetErr(msg)
    resetErr(msg2)
}




// Accepte Data 

let acceptData = ()=>{
    let state
    let chosenDate

    if(document.getElementById("notyet").checked == true)
    {
        state = false
    }else
    {
        state = true
    }

    if(inputDate.value == "")
    {
        chosenDate = formatDate(new Date() )
    }else
    {
        chosenDate = inputDate.value
    }

    console.log(inputDate.value)
   
    let newTask = 
        {
            title : inputTitle.value,
            description : inputDescription.value,
            date : chosenDate,
            isdone : state
        }   

    return newTask
}



// Add new Task 

addNewTask = (e)=>{

    document.getElementById("save").style.display = "initial"
    document.getElementById("update").style.display = "none"
    document.getElementById("popup-title").style.display = "initial"
    document.getElementById("popup-title-edit").style.display = "none"

    togglePopup()    

    
}


document.getElementById("save").addEventListener("click",(e)=>{
    e.preventDefault()
    if (formValidation() == true){
    let task = acceptData() 
    taskdb.push(task)
    let taskJson = JSON.stringify(taskdb)
    localStorage.setItem("mytasks",taskJson)
    togglePopup()
    setTimeout(readData(), 2000)
    }
})

document.getElementById("addTask").addEventListener("click",(e)=>{
    document.getElementById("popup-title").style.display = "block"
    document.getElementById("popup-title-edit").style.display = "none"
})



// check task 

checkTask = (e)=>{
    if (taskdb[e].isdone == true)
    {
        taskdb[e].isdone = false
    }
    else
    {
        taskdb[e].isdone = true
    }

    taskdb.splice(e , 1, taskdb[e])
    let jsonTask = JSON.stringify(taskdb)
    localStorage.setItem("mytasks",jsonTask)

    setTimeout(readData(), 2000)

}



//delete task

let deleteIndex

function getdelindex(e){
    deleteIndex = e
    document.getElementById("deleted-task-t").innerHTML = "' "+taskdb[deleteIndex].title+" '"
}



// onclick="removeTask(i)"

removeTask = (deleteIndex)=>{
    

    //console.log(deleteIndex);
    taskdb.splice(deleteIndex , 1)
    let jsonTask = JSON.stringify(taskdb)
    localStorage.setItem("mytasks",jsonTask)
    // e.parentElement.parentElement.remove();

    setTimeout(readData(), 2000)
}



//edit task 

let editIndex

editTask = (e)=>{

    document.getElementById("save").style.display = "none"
    document.getElementById("update").style.display = "initial"
    document.getElementById("popup-title").style.display = "none"
    document.getElementById("popup-title-edit").style.display = "block"

    editIndex = e;    

    togglePopup()    
    
    inputTitle.value = taskdb[e].title
    inputDescription.value = taskdb[e].description
    inputDate.value = taskdb[e].date
    if(taskdb[e].isdone == true){
        document.getElementById("done").checked = true
    }
    
}


document.getElementById("update").addEventListener("click",(e)=>{   
    e.preventDefault()
    if (formValidation() == true){
        let task = acceptData()
        taskdb.splice(editIndex, 1 , task)
        let taskJson = JSON.stringify(taskdb)
        localStorage.setItem("mytasks",taskJson)
        togglePopup()
        setTimeout(readData(), 2000)
    }

})




//Form Validation 

let formValidation = () => {
    resetErr(msg)
    resetErr(msg2)

    if(inputTitle.value == "" || inputDescription.value == "" )
    {
        if(inputTitle.value == "" && inputDescription.value == ""){
            msg.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> Title cannot be blank"
            msg2.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> Descrition cannot be blank"
            err(msg)
            err(msg2)
            return false
        }else
        if(inputTitle.value == ""){
            msg.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> Title cannot be blank"
            msg2.innerHTML = ""
            err(msg)
            return false
        }
        else if (inputDescription.value == "")
        {
            msg.innerHTML = ""
            msg2.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> Descrition cannot be blank"
            err(msg2)
            return false
        }
        
    }
    

    if(inputTitle.value != "" && inputDescription.value != "" )
    {
        msg.innerHTML = ""
        msg2.innerHTML = ""
        return true
    }
}


let err = (e) => {
    e.classList.add("err")
}

let resetErr = (e) =>{
    e.classList.remove("err")
}





