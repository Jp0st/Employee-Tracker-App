INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("Bob","Jones","1","2"),
        ("Tom","Burnes","2","3"),
        ("Denise", "McCardy","3","4"),
        ("Peter","Pan","4","4"),
        ("David", "Wolf", "2", "2"),
        ("Paul", "Peterson", "1", null)
        ("Stephanie","Simone","1","3");

INSERT INTO role(title, salary, department_id)
VALUES  ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 125000, 3),
        ("Legal Team Lead", 250000, 4),
        ("Lawyer", 190000, 4);

INSERT INTO department(name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");
```

