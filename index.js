// fetch using custom attribute
const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyButton = document.querySelector("[data-copy]");

const copyMsg = document.querySelector("[data-copyMSG]");

const uppercaseCheck = document.querySelector("#uppercase"); 

const lowercaseCheck = document.querySelector("#lowercase"); 

const numbersCheck = document.querySelector("#numbers"); 

const symbolCheck = document.querySelector("#symbol"); 

const indicator = document.querySelector("data-indicator");

const generateBtn = document.querySelector(".generateButton");

const allCheckbox = document.querySelectorAll("input[type=checkbox]");

const symbolString = '!~@#$%^&*()_+={[}]:;"<,>.?/';

//in default case starting password is empty
let password = "";

//in default case password length is 10
let passwordLength = 10;

// in default case uppercase check box is already checked
let checkCount = 0;
handleSlider();

// by defualt strength circle color is set to greyish




// set passwordLength --> reflect it on UI
function handleSlider(){
   inputSlider.value = passwordLength;
   lengthDisplay.innerText = passwordLength;

}

// set color of indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow 
    // indicator.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.2)';
}

// generate random integer
function getRandomInteger(min,max){
    // min se lekr max ke bich mai 
    // Math.floor --> round off it gives floor value--> int value
   return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randomNumber = getRandomInteger(0, symbolString.length);
    // charAt --> charcater at that index
     return symbolString.charAt(randomNumber);
}

function calculateStrength(){
  // by default  
  let hasUpper = false;  
  let hasLower = false;  
  let hasNum = false;  
  let hasSymbol = false;  

  //.checked--> this verify if checkbox is ticked or not
  if(uppercaseCheck.checked)hasUpper= true;
  if(lowercaseCheck.checked)hasLower= true;
  if(numbersCheck.checked)hasNum= true;
  if(symbolCheck.checked)hasSymbol= true;

  if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8){
    setIndicator("#0f0");
  }
  else if( (hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength>=6){
    setIndicator("#ff0");
  } 
  else{
    setIndicator("#f00");
  }
}


//copy content on clipboard
async function copyContent(){
  try{
   // value copy on clipboard
   await navigator.clipboard.writeText(passwordDisplay.value); // this return promise which is asynchronous
   copyMsg.innerText = "copied";
  }
  catch(e){
   copyMsg.innerText = "failed";
  }

  // span will visible
  copyMsg.classList.add("active");

  // invisible the span after some time--> copied wala msg kuch der baad hat jaega
  setTimeout(()=>{
  copyMsg.classList.remove("active");
  },2000);
}


// shuffle password
function shufflePassword(array){
    //fisher yates methord

    for(let i = array.length -1; i>0 ;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el)=>(str += el));
    return str;
   
}


// event listner on slider
inputSlider.addEventListener('input', (e)=>{
    // slider ki value passwordlength mai aajaegi
    passwordLength = e.target.value;
    //call this function
    handleSlider();
});

// event listner at copy button
copyButton.addEventListener('click' , ()=>{
    // if there is any value then copy it
    if(passwordDisplay.value){
        copyContent();
    }
    // if(password.length>0){
    //    copyContent(); 
    // }
} );

// event listner at check box
// whenever checkbox status change it will count from starting again
function handleCheckboxChange(){
    checkCount =0;
    allCheckbox.forEach((Checkbox)=>{
        if(Checkbox.checked){
            checkCount++;
        }
    });

    // special case
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckbox.forEach((Checkbox)=>{
    Checkbox.addEventListener('change' , handleCheckboxChange);
});

// event listner on generate password
generateBtn.addEventListener('click' , ()=>{
    //none of the check boxare selected
    if(checkCount == 0)
    return ;
    
    //special case condition
    if(passwordLength<checkCount){
       passwordLength = checkCount;
       handleSlider();
    }
       
    //let's start the journey to find new password
    console.log("starting the journey");

    // remove old password
    password = "";

    //let's put the stuff mentioned by checkbox
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }
    
    let funcArr = [];
   if(uppercaseCheck.checked)
      funcArr.push(generateUpperCase);
   if(lowercaseCheck.checked)
      funcArr.push(generateLowerCase);
   if(numbersCheck.checked)
      funcArr.push(generateRandomNumber);
   if(symbolCheck.checked)
      funcArr.push(generateSymbol);
    
   // compulsory addition
   for(let i=0 ; i<funcArr.length ; i++ ){
    password += funcArr[i]();
   }
   console.log("compulsory addition done");
   
   // remaining addition
   for(let i=0 ; i<passwordLength- funcArr.length ; i++ ){
         let randomIndex = getRandomInteger(0 , funcArr.length);
         console.log("randomIndex" +randomIndex);
         password += funcArr[randomIndex]();
   }
   console.log("remaining addition done");

   // shuffle the password
   // pass this in the form of array
   password = shufflePassword(Array.from(password));
   console.log("shuffling  done");

    
   //show password in UI
   passwordDisplay.value = password;
   console.log("UI update done");

   // calculate strength function
   calculateStrength();

});



