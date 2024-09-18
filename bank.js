#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
class Account {
    accountNumber;
    accountHolder;
    balance;
    constructor(accountNumber, accountHolder, balance) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = balance;
    }
    getAccountNumber() {
        return this.accountNumber;
    }
    getAccountHolder() {
        return this.accountHolder;
    }
    getBalance() {
        return this.balance;
    }
    deposit(amount) {
        this.balance += amount;
    }
    withdraw(amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        else {
            return false;
        }
    }
}
class Bank {
    accounts;
    constructor() {
        this.accounts = [];
    }
    createAccount(accountHolder, initialBalance) {
        const accountNumber = this.accounts.length + 1;
        const account = new Account(accountNumber, accountHolder, initialBalance);
        this.accounts.push(account);
    }
    getAccount(accountNumber) {
        return this.accounts.find((account) => account.getAccountNumber() === accountNumber);
    }
    deposit(accountNumber, amount) {
        const account = this.getAccount(accountNumber);
        if (account) {
            account.deposit(amount);
            return true;
        }
        else {
            return false;
        }
    }
    withdraw(accountNumber, amount) {
        const account = this.getAccount(accountNumber);
        if (account) {
            return account.withdraw(amount);
        }
        else {
            return false;
        }
    }
}
async function main() {
    const bank = new Bank();
    while (true) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'option',
                message: 'Select an option:',
                choices: [
                    'Create Account',
                    'Deposit',
                    'Withdraw',
                    'Check Balance',
                    'Exit',
                ],
            },
        ]);
        switch (answers.option) {
            case 'Create Account':
                const createAccountAnswers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'accountHolder',
                        message: 'Enter account holder name:',
                    },
                    {
                        type: 'input',
                        name: 'initialBalance',
                        message: 'Enter initial balance:',
                    },
                ]);
                bank.createAccount(createAccountAnswers.accountHolder, parseInt(createAccountAnswers.initialBalance));
                console.log(chalk.green(`Account created successfully!`));
                break;
            case 'Deposit':
                const depositAnswers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'accountNumber',
                        message: 'Enter account number:',
                    },
                    {
                        type: 'input',
                        name: 'amount',
                        message: 'Enter amount to deposit:',
                    },
                ]);
                if (bank.deposit(parseInt(depositAnswers.accountNumber), parseInt(depositAnswers.amount))) {
                    console.log(chalk.green(`Deposit successful!`));
                }
                else {
                    console.log(chalk.red(`Account not found!`));
                }
                break;
            case 'Withdraw':
                const withdrawAnswers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'accountNumber',
                        message: 'Enter account number:',
                    },
                    {
                        type: 'input',
                        name: 'amount',
                        message: 'Enter amount to withdraw:',
                    },
                ]);
                if (bank.withdraw(parseInt(withdrawAnswers.accountNumber), parseInt(withdrawAnswers.amount))) {
                    console.log(chalk.green(`Withdrawal successful!`));
                }
                else {
                    console.log(chalk.red(`Account not found or insufficient balance!`));
                }
                break;
            case 'Check Balance':
                const checkBalanceAnswers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'accountNumber',
                        message: 'Enter account number:',
                    },
                ]);
                const account = bank.getAccount(parseInt(checkBalanceAnswers.accountNumber));
                if (account) {
                    console.log(chalk.blue(`Balance: ${account.getBalance()}`));
                }
                else {
                    console.log(chalk.red(`Account not found!`));
                }
                break;
            case 'Exit':
                return;
        }
    }
}
main();
