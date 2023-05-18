const canvas = document.querySelector("canvas"),
toolButtons = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorsBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");


//global variables with default values
let prevMouseX , prevMouseY, snapshot ,
isDrawing = false;
selectedTool = "brush"
brushWidth = 3;
selectedColor = "#000";


const setCanvasBackground = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width , canvas.height);
    ctx.fillStyle = selectedColor;
    
}



window.addEventListener("load" , ()=>{
    canvas.width = canvas.offsetWidth; //setting canvas width offsetwidth returns vieable width of canvas
    canvas.height = canvas.offsetHeight; //setting canvas height offsetheight returns vieable height of canvas
    setCanvasBackground();
})


const drawRect = (e) => {
    //if fillcolor is not checked draw a rect with border wlse rect with background

    if(!fillColor.checked){
      return  ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX ,prevMouseY - e.offsetY ) ;
    }
     ctx.fillRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX ,prevMouseY - e.offsetY );
     fillColor.checked ? ctx.fill(): ctx.stroke();


}

const drawCircle = (e) => {
    ctx.beginPath(); //creating new path to draw circle

    //getting radious for circle according to the mouse pointer
    let radious = Math.sqrt(Math.pow((prevMouseX - e.offsetX) , 2) + Math.pow((prevMouseY - e.offsetY) , 2));
    ctx.arc(prevMouseX , prevMouseY , radious , 0 , 2*Math.PI) //creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill(): ctx.stroke();
}

const drawTriangle = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX , prevMouseY);
    ctx.lineTo(e.offsetX , e.offsetY);
    ctx.lineTo(prevMouseX *2 - e.offsetX , e.offsetY)
    ctx.closePath();
    fillColor.checked ? ctx.fill(): ctx.stroke();

}


const startDraw = (e) =>{
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushWidth; //passing brushSize as kine width
    //copying canvas data and passing as a sanpshot value...this avoids dragging the image
    snapshot = ctx.getImageData(0 , 0 , canvas.width , canvas.height);

    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
}




const drawing = (e)=>{
    if(!isDrawing) return; //if isDrawing is false return from here
    ctx.putImageData(snapshot , 0 , 0); //adding copied canvas data on to this canvas
    if(selectedTool === "brush" || selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX , e.offsetY); //creating line accoring to the mouse pointer
     ctx.stroke(); //drawing/filling line with color
    }   else if (selectedTool === "rectangle"){
        drawRect(e);
    } else if (selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle (e);
    }

    
    
}

toolButtons.forEach((btn)=>{
    btn.addEventListener("click" , ()=>{ //adding click event to all option

    //removing active class from the previos option anda dding on current clicked option        
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active")
    selectedTool = btn.id;

        
        
    console.log(selectedTool);
    })
})


sizeSlider.addEventListener("change" , () => brushWidth = sizeSlider.value);

colorsBtns.forEach(btn => {
    btn.addEventListener("click" , () =>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected")
        selectedColor= (window.getComputedStyle(btn).getPropertyValue("background-color"));
    });
});


colorPicker.addEventListener("change" , ()=>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener ("click" , ()=>{
    ctx.clearRect(0,0,canvas.width , canvas.height);
    setCanvasBackground();
})

saveImg.addEventListener ("click" , ()=>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL();
    link.click();
})



canvas.addEventListener("mousedown" , startDraw);
canvas.addEventListener("mousemove" , drawing);
canvas.addEventListener("mouseup" , ()=> isDrawing = false);