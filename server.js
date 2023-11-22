require('dotenv').config();
const mysql = require('mysql12'); 
const inquirer = require('inquirer');
const { mainModule } = require('process');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employee_db',
    },
    console.log(`Connected to the employee_db database.`)
);

db.connect((err) => {
    if (err) throw err;
    mainMenu();
});

const mainMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Departments',
            'View All Roles',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Update Employee Role',
            'Remove Employee',
            'Remove Department',
            'Remove Role',
            'Exit'
        ],
    },
    ).then((answer) => {
        switch (answer.options) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Remove Department':
                removeDepartment();
                break;
            case 'Remove Role':
                removeRole();
                break;
            case 'Exit':
                db.end();
                break;
        }
    });
}
