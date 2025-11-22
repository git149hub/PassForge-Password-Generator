const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#upperCase");
const lowercaseCheck = document.querySelector("#lowerCase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatorBtn = document.querySelector(".generateButton");
const allcheckBox = document.querySelectorAll('input[type="checkbox"]');
const symbolsString = " / * - + = % & | ^ ~ ! @ # $ ( ) { } [ ] < > . , ; : ? ' \" ` \\ / _ - ";




let password = "";
let passwordLength = 10;
let checkCount = 0;


//calling function handleSlider
handleSlider();




//set password length 
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}



//set indicator
setIndicator("#ccc");

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 10px ${color}`;
}


// set random numbers, letters uppercase and lowercase, and symbols 

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
    let random = getRndInteger(0, symbolsString.length);
    return symbolsString.charAt(random);
}


//setting the indicator color
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (symbolsCheck.checked) hasSymbol = true;
    if (numbersCheck.checked) hasNum = true;

    if (hasLower && hasUpper && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }

}


// copying the text to clip board

async function copyText() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }

    catch (e) {
        copyMsg.innerText = "failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});


function handleCheckBoxChange() {
    checkCount = 0;
    allcheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;

    });

    //special conditions
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
} 

allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});


copyBtn.addEventListener('click', () => {
    if (passwordDisplay) {
        copyText();
    }
});

//  now create the shuffle password function using 
//  fisher yates method

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


generatorBtn.addEventListener('click', () => {

    //when non of the check boxes are selected
    if (checkCount <= 0) {
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }


    // now start the process to find the new password

    //remove the old password

    password = "";

    //now put the stuff mentioned by checkboxes

    let funArr = [];

    if (uppercaseCheck.checked) {
        funArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funArr.push(generateSymbols);
    }

    //compulsory addition 

    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    //remaining addition 
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    // now shuffal the password
    password = shufflePassword(Array.from(password));


    // show in ui
    passwordDisplay.value = password;


    //calculate strength

    calcStrength();


});