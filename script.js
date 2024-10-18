const balance = document.getElementById("balance");
const income_amt = document.getElementById("income");
const expense_amt = document.getElementById("expenditure");
const income_description = document.getElementById("description_inc");
const income_amount = document.getElementById("amount_inc");
const expense_description = document.getElementById("description_exp");
const expense_amount = document.getElementById("amount_exp");

const income_btn=document.getElementById("btn1");
const expense_btn=document.getElementById("btn2");


const clear_btn=document.getElementById("clear");


const transaction = document.getElementById("trans");

const localStorageTrans=JSON.parse(localStorage.getItem("trans"));

let transdata = localStorage.getItem("trans")!==null?localStorageTrans : [] ;

function loadTransaction(transactiondata) {
    let item = document.createElement("li");
    let sign = transactiondata.amount < 0 ? "-" : "+";
    item.classList.add(transactiondata.amount < 0 ? "exp" : "inc");
    item.innerHTML = `
        ${transactiondata.description} <span>${sign}${Math.abs(transactiondata.amount)}</span>
        <button class="del-btn" onclick="removeTransaction(${transactiondata.id})">x</button>
    `;

    transaction.appendChild(item);

}

function removeTransaction(id) {
    transdata=transdata.filter((transactiondata)=>transactiondata.id != id);
    loadContents();
    updateLocalStorage();
}

function updateAmount() {

    const amounts=transdata.map((transaction)=>transaction.amount);
    const total=amounts.reduce((acc,item)=>(acc+=item),0).toFixed(2);
    
    balance.innerHTML=`Rs.${total}`
    if (total<0) {
        balance.classList.add("minus-Bal")
    }
    else{
        balance.classList.add("Bal");
    }
    
    const income=amounts.filter((amt)=>amt>0).reduce
    ((acc,amt)=>(acc+=amt),0);
    income_amt.innerHTML=`Rs.${income}`

    const expense=amounts.filter((amt)=>amt<0).reduce
    ((acc,amt)=>(acc+=amt),0);
    expense_amt.innerHTML=`Rs.${Math.abs(expense)}`



}


function loadContents() { 
    transaction.innerHTML = "";
    transdata.forEach(loadTransaction);
    updateAmount();
}


function addTransaction(e,isIncome) {
    e.preventDefault();
    const description=isIncome ? income_description.value : expense_description.value;
    const amount=isIncome ? income_amount.value : (expense_amount.value)*-1;
    if(description.trim()=="" || isNaN(amount)){
        alert("please enter description and amount")
    }
    else{
        const newTransaction={ 
            id: generateId(),
            description: description,
            amount:parseFloat(amount) 
        };

            transdata.push(newTransaction);
            loadTransaction(newTransaction);
            updateAmount();
            updateLocalStorage();

    }

}

income_btn.addEventListener("click",(e)=>addTransaction(e,true));

expense_btn.addEventListener("click",(e)=>addTransaction(e,false));

function updateLocalStorage() {
    localStorage.setItem("trans",JSON.stringify(transdata));
}

function generateId() {
    return Math.floor(Math.random()*1000000);
}

clear_btn.addEventListener("click",clearAll);


function clearAll() {
    transdata=[];
    updateLocalStorage();
    loadContents();
}


loadContents();