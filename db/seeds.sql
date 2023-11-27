-- Inserting Departments
INSERT INTO department(name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

-- Inserting Roles
INSERT INTO role(title, salary, department_id)
VALUES  ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 125000, 3),
        ("Legal Team Lead", 250000, 4),
        ("Lawyer", 190000, 4);

-- Inserting Employees (without manager_id)
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("Bob", "Jones", "1", null),
        ("Tom", "Burnes", "2", null),
        ("Denise", "McCardy", "3", null),
        ("Peter", "Pan", "4", null),
        ("David", "Wolf", "1", null),
        ("Paul", "Peterson", "5", null);

-- Update manager_id values
UPDATE employee SET manager_id = 2 WHERE first_name = "Bob";
UPDATE employee SET manager_id = 3 WHERE first_name = "Tom";
UPDATE employee SET manager_id = 5 WHERE first_name = "Denise" OR first_name = "Peter";

