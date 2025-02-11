// Get elements
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseTable = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
const totalAmountDisplay = document.getElementById('total-amount');

// Initialize expenses array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Event listener for form submission
expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const expenseName = expenseNameInput.value.trim();
    const expenseAmount = parseFloat(expenseAmountInput.value.trim());

    if (expenseName && expenseAmount > 0) {
        // Add expense to array
        const newExpense = { name: expenseName, amount: expenseAmount };
        expenses.push(newExpense);

        // Save expenses to local storage
        //localStorage.setItem('expenses', JSON.stringify(expenses));

        // Clear inputs
        expenseNameInput.value = '';
        expenseAmountInput.value = '';

        // Update UI
        renderExpenses();
    }
});

// Function to render expenses
function renderExpenses() {
    // Clear the table
    expenseTable.innerHTML = '';

    // Calculate total amount
    let total = 0;

    // Populate table with expenses
    expenses.forEach((expense, index) => {
        const row = expenseTable.insertRow();
        row.innerHTML = `
            <td>${expense.name}</td>
            <td>Rs${expense.amount.toFixed(2)}</td>
            <td><button class="btn btn-warning" onclick="editExpense(${index})">Edit</button></td>
            <button class="btn btn-danger" onclick="removeExpense(${index})">Remove</button>
        `;
        total += expense.amount;
    });

    // Display total amount
    totalAmountDisplay.textContent = total.toFixed(2);
}

// Function to remove an expense
function removeExpense(index) {
    // Remove expense from array
    expenses.splice(index, 1);

    // Update local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Re-render the expenses
    renderExpenses();
}
function editExpense(index) {
    // Get the expense data by index
    const expense = expenses[index];

    // Set the input fields to the current expense data
    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;

    // Change the form button text to 'Update Expense'
    const submitButton = expenseForm.querySelector('button');
    submitButton.textContent = 'Update Expense';

    // Remove the expense on edit (if the user updates and submits)
    expenseForm.removeEventListener('submit', addExpenseHandler);
    expenseForm.addEventListener('submit', function updateExpenseHandler(e) {
        e.preventDefault();

        const updatedName = expenseNameInput.value.trim();
        const updatedAmount = parseFloat(expenseAmountInput.value.trim());

        if (updatedName && updatedAmount > 0) {
            // Update the expense in the array
            expenses[index] = { name: updatedName, amount: updatedAmount };

            // Update local storage
            localStorage.setItem('expenses', JSON.stringify(expenses));

            // Clear inputs and reset button text
            expenseNameInput.value = '';
            expenseAmountInput.value = '';
            submitButton.textContent = 'Add Expense';

            // Re-render the expenses
            renderExpenses();

            // Reattach the original add expense handler
            expenseForm.removeEventListener('submit', updateExpenseHandler);
            expenseForm.addEventListener('submit', addExpenseHandler);
        }
    });
}


// Render expenses on initial load
renderExpenses();
