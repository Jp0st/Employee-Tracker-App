require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { mainModule } = require('process');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

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

const viewAllEmployees = () => {
    sql = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    `;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        };
        console.table(rows);
        mainMenu();
    });
};

const viewAllDepartments = () => {
    sql = `
    SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        };
        console.table(rows);
        mainMenu();
    });
};

const viewAllRoles = () => {
    sql = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    LEFT JOIN department ON role.department_id = department.id
    `;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        };
        console.table(rows);
        mainMenu();
    });
};

const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What department would you like to add?',
    }).then((answer) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answer.department], (err, rows) => {
            if (err) {
                console.log(err);
            };
            console.log('Department added!');
            mainMenu();
        });
    });
};

const addEmployee = () => {
    let getMan = 'SELECT id, first_name, last_name FROM employee WHERE manager_id IS NOT NULL';
    let getRole = 'SELECT role.id, title FROM role';

    const getManPromise = new Promise((resolve, reject) => {
        db.query(getMan, (err, rows) => {
            if (err) {
                reject(err);
            }

            console.log('Rows from getMan query:', rows);

            if (rows) {
                resolve(rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id })));
            } else {
                resolve([]);
            }
        });
    });

    const getRolePromise = new Promise((resolve, reject) => {
        db.query(getRole, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows.map(({ id, title }) => ({ name: title, value: id })));
        });
    });

    Promise.all([getManPromise, getRolePromise])
        .then(([managerChoices, roleChoices]) => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the employee\'s first name?',
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the employee\'s last name?',
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employee\'s role?',
                    choices: roleChoices,
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the employee\'s manager?',
                    choices: [...managerChoices, { name: 'None', value: null }],
                },
            ]).then((answer) => {
                let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                let manager_id = answer.manager;
                db.query(
                    sql,
                    [answer.first_name, answer.last_name, answer.role, manager_id],
                    (err, rows) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log('Employee added!');
                        mainMenu();
                    }
                );
            });
        })
        .catch(err => console.log(err));
};


const addRole = () => {
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) {
            console.log(err);
        }
        const departmentChoices = rows.map((department) => ({
            name: department.name,
            value: department.id
        }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the role\'s title?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the role\'s salary?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'What is the role\'s department?',
                choices: departmentChoices,
            },
        ]).then((answer) => {
            db.query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [answer.title, answer.salary, answer.department],
                (err, rows) => {
                    if (err) {
                        console.log(err);
                    };
                    console.log('Role added!');
                    mainMenu();
                }
            );
        }
        );
    }
    )
};

const updateEmployeeRole = () => {
    const employeeList = 'SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee FROM employee';
    const roleList = 'SELECT role.id, role.title FROM role';

    db.query(employeeList, (err, rows) => {
        if (err) {
            console.log(err);
        }
        const employeeChoices = rows.map((employee) => ({
            name: employee.employee,
            value: employee.id
        }));
        const roleChoices = rows.map((role) => ({
            name: role.title,
            value: role.id
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to edit?',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s new role?',
                choices: roleChoices,
            },
        ]).then((answer) => {
            db.query(
                `UPDATE employee SET role_id = ? WHERE id = ?`,
                [answer.role, answer.employee],
                (err, rows) => {
                    if (err) {
                        console.log(err);
                    };
                    const employee = rows.find((employee) => employee.id === answer.employee);
                    console.log('Employee role updated!');
                    mainMenu();
                }
            );
        });
    });
};

const removeEmployee = () => {
    const employeeList = 'SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee FROM employee';

    db.query(employeeList, (err, rows) => {
        if (err) {
            console.log(err);
        }
        const employeeChoices = rows.map((employee) => ({
            name: employee.employee,
            value: employee.id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to remove?',
                choices: employeeChoices,
            },
        ]).then((answer) => {
            const query = `DELETE FROM employee WHERE id = ?`;
            db.query(query, answer.employee, (err, rows) => {
                if (err) {
                    console.log(err);
                };
                console.log('Employee removed!');
                mainMenu();
            });
        });
    });
};

const removeDepartment = () => {
    const getDepartments = 'SELECT * FROM department';
    db.query(getDepartments, (err, departments) => {
        if (err) {
            console.log(err);
        }
        const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department would you like to remove?',
                choices: departmentChoices,
            },
        ]).then((answer) => {
            const query = `DELETE FROM department WHERE id = ?`;
            db.query(query, answer.department, (err, rows) => {
                if (err) {
                    console.log(err);
                };
                console.log('Department removed!');
                mainMenu();
            });
        });
    });
};

const removeRole = () => {
    const getRoles = 'SELECT * FROM role';
    db.query(getRoles, (err, roles) => {
        if (err) {
            console.log(err);
        }
        const roleChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to remove?',
                choices: roleChoices,
            },
        ]).then((answer) => {
            const query = `DELETE FROM role WHERE id = ?`;
            db.query(query, answer.role, (err, rows) => {
                if (err) {
                    console.log(err);
                };
                console.log('Role removed!');
                mainMenu();
            });
        });
    });
};  