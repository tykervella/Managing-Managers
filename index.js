//importing packages 
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// initializing mysql2 and connecting to employee_db to allow us to run mysql queries via node.JS
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'BC@mp2023$',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Database connection established successfully.');
  });

///////////// FUNCTIONS TO HANDLE THE ACTUAL CODE THAT INTERACTS WITH OUR employee_db  ///////////// 

/////// FUNCTIONS THAT INTERACT DIRECTLY WITH DEPARTMENTS TABLE  /////// 

//// Function to view all departments stored within the department table ////

function departments() { 
  db.promise().query('SELECT * FROM department')
    .then(([req, res]) => {
      const departments = req.map(req => ({ id: req.id, department_name: req.department_name }));
      // sorts new mapped array to be in order based on employee id 
      departments.sort((a, b) => a.id - b.id);
      //calls cTable to take the promised data that has been manipulated and turn into a table that is then displayed on the console
      const table = cTable.getTable(departments);
      console.table(table);
      // runs prompt to allow user to continue using the application 
      returnMain()
    })
    .catch(err => console.log(err));
  }

  //// function to add a new department ////

  function addDepartment() {
    // prompt to have user enter the new department_name

    inquirer
    .prompt([
      {
        type: 'text',
        name: 'name',
        message: 'What is the name of the new department?',
      },
    ])
    .then((data) => {
      //take the user entry and Capitalize it. 
      const department = data.name;
      const capitalized = department.charAt(0).toUpperCase() + department.slice(1).toLowerCase();
      console.log(`Adding ${capitalized} to departments...`)
      // insert the new department's name into the department table with an auto incrementing id 
      db.query(`INSERT INTO department(department_name) VALUES ("${capitalized}");`);
      returnMain()
    })
    .catch(err => console.log(err));
  }

  /////// FUNCTIONS THAT INTERACT DIRECTLY WITH ROLE TABLE /////// 

// // complex sql query stored as a template literal variable and then used within the roles function 
// const rquery = `SELECT role.id, role.title, role.salary, department.department_name FROM role JOIN department ON role.department_id = department.id;`

//// function that uses the rquery to return a promise that consists of a table that includes ALL the data associated with a single role. This takes the title and role information from the role table which is joined with department_name data from the department table. ////

function roles() { 
  db.promise().query(`SELECT role.id, role.title, role.salary, department.department_name FROM role JOIN department ON role.department_id = department.id;`)
    .then(([req, res]) => {
      const roles = req.map(req => ({ id: req.id, title: req.title, salary: req.salary, department_name: req.department_name }));
      // sorts new mapped array to be in order based on role id 
      roles.sort((a, b) => a.id - b.id);
      //calls cTable to take the promised data that has been manipulated and turn into a table that is then displayed on the console
      const table = cTable.getTable(roles);
      console.table(table);
      // runs prompt to allow user to continue using the application 
      returnMain()  
    })
    .catch(err => console.log(err));
  }

  //// function to add a new role ////

  function addRole() {
    db.promise().query(`SELECT * FROM department`)
    .then(([req, res]) => {
      const departments= req.map(req => ({name: req.department_name, value: req.id }));
      
      inquirer
      .prompt([
        {
          type: 'text',
          name: 'title',
          message: 'What is the title of the new role?',
        },
        {
          type: 'text',
          name: 'salary',
          message: 'What is the salary of the new role?',
        },
        {
          type: 'list',
          name: 'department',
          message: 'What department is it in?',
          choices: departments,
        },
      ])
      .then((data) => {
        //take the user entry and Capitalize it. 
        const title = data.title.trim();
        const capitalized = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
        console.log(`Adding ${capitalized} to roles...`)
        const department = data.department;
        //take the user entry and turn it into an integer 
        const salary = parseInt(data.salary);
        // insert the new department's name into the department table with an auto incrementing id 
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${capitalized}", ${salary},${department});`);
        returnMain()
      });
    });
  }

// // complex sql query stored as a template literal variable and then used within the employees function //
// const equery = `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
//   FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS m ON e.manager_id = m.id;`

//// function that returns a promise that consists of a table that includes ALL the data associated with a single employee ID.This takes the employee's id, first and last name from the employee table and joins it with the salary and title data from the role table and the department_name from the department table  ////

function employees() { 
  db.promise().query(`SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
  FROM employee AS e JOIN role AS r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS m ON e.manager_id = m.id;`)
    .then(([req, res]) => {
      const employees = req.map(req => ({ id: req.id, employee_name: `${req.first_name} ${req.last_name}`, title: req.title, department: req.department_name, salary: req.salary, manager: req.manager_name}));
      // sorts new mapped array to be in order based on employee id 
      employees.sort((a, b) => a.id - b.id);
      //calls cTable to take the promised data that has been manipulated and turn into a table that is then displayed on the console
      const table = cTable.getTable(employees);
      console.table(table);
      // runs prompt to allow user to continue using the application 
      returnMain()
    })
    .catch(err => console.log(err));
}

function addEmployee() {

  const newEmployee = {};
  db.promise().query(`SELECT id AS employee_id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee`)
  .then(([req, res]) => {
    const employees = req.map(req => ({name: req.employee_name, value: req.employee_id }));
    
    inquirer
    .prompt([
      {
        type: "text",
        name: "first",
        message: "What is the new employee's first name?",
      },
      {
        type: "text",
        name: "last",
        message: "What is the new employee's last name?",
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the new employee's boss?",
        choices: employees,
      },
    ])
    .then((data) => {
      const firstName = data.first.trim();
      const capitalized1 = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      const lastName = data.last.trim();
      const capitalized2 = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      const manager = data.manager;
      newEmployee.firstName = capitalized1;
      newEmployee.lastName = capitalized2;
      newEmployee.managerId = manager;
      secondQuery();
    })

  });

  function secondQuery() {
    db.promise().query(`SELECT id AS roleId, title FROM role`)
    .then(([req, res]) => {
      const roles = req.map(req => ({name: req.title, value: req.roleId}))

      inquirer
      .prompt([
        {
        type: "list",
        name: "role",
        message: "What is the new employee's role?",
        choices: roles,
        },
      ])
      .then((data) => {
        const role = data.role;
        newEmployee.roleId = role;

        console.log(newEmployee);

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${newEmployee.firstName}", "${newEmployee.lastName}", ${newEmployee.roleId}, ${newEmployee.managerId});`);
        returnMain()

      });
    });
  };
}

function updateRole() {
  const newRole = {};

  db.promise().query(`SELECT id AS employee_id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee`)
    .then(([req, res]) => {
      const employees = req.map(req => ({ name: req.employee_name, value: req.employee_id }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee's role do you wish to update?",
            choices: employees,
          },
        ])
        .then((data) => {
          const employee = data.employee;
          newRole.employeeId = employee;
          dQuery();
        });
    });

  function dQuery() {
    db.promise().query(`SELECT id AS roleId, title FROM role`)
      .then(([req, res]) => {
        const roles = req.map(req => ({ name: req.title, value: req.roleId }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's new role?",
              choices: roles,
            },
          ])
          .then((data) => {
            const role = data.role;
            newRole.roleId = role;

            db.query(`UPDATE employee SET role_id = ${newRole.roleId} WHERE id = ${newRole.employeeId}`);
            console.log("Role updated successfully!");
            returnMain();
          });
      });
  }
}


///////////// COMMAND LINE INTERFACE FUNCTIONS ///////////// 

//// function that is called upon loading the page. User is prompted to choose an action from a list which will call other functions to run the necessary functions to accomplish what the user selected. ////

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'Main',
        choices: [
          // gives each option a unique value that is returned as a promise
          {name: "View all departments.", value: 001},
          {name: "View all roles.", value: 002},
          {name: "View all employees.", value: 003},
          {name: "Add a department.", value: 004},
          {name: "Add a role.", value: 005},
          {name: "Add an employee.", value: 006},
          {name: "Update an employee role.", value: 007}
        ]
      },
    ])
    // based on the value of what the user choose in the Main prompt, runs a switch function to execute the functions for the action the user selected 
    .then((data) => {
      switch (data.Main) {
      case 1:
        console.log('Viewing all departments...');
        departments();
        break;
      case 2:
        console.log('Viewing all roles...');
        roles();
        break;
      case 3:
        console.log('Viewing all employees...');
        employees()
        break;
      case 4:
        console.log('Adding a department...');
        addDepartment();
        break;
      case 5:
        console.log('Adding a role...');
        addRole();
        break;
      case 6:
        console.log('Adding an employee...');
        addEmployee();
        break;
      case 7:
        console.log(`Updating employee's role...`);
        updateRole();
        break;
    }
  });
}

//// After executing the selected action, prompt the user to return to the main menu ////

function returnMain() {
  inquirer
  // return a promise that is a boolean
  .prompt([
    {
      type: 'confirm',
      name: 'Return',
      message: 'Return to main menu?',
    },
  ]) 
  // if user wants to continue, call mainMenu to allow the user to take another action
  .then((data) => {
    if (data.Return) {
      mainMenu();
    } else {
      // If user chooses "N", gives a special farewell message
      console.log('Goodbye!');
    }
  });
}

// Call the mainMenu function to start the prompt when node index.js is run
mainMenu();