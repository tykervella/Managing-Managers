INSERT INTO department (department_name)
VALUES ("Produce"),
       ("Front End"),
       ("Back End"),
       ("Deli"),
       ("Bakery"),
       ("Customer Service");
       
INSERT INTO role (title, salary, department_id)
VALUES ("General Manager", 95000, 002),
       ("Front End Manager", 75000.00, 002),
       ("Produce Manager", 70000.00, 001),
       ("Deli Manager", 70000, 004),
       ("Bakery Manager", 70000, 005),
       ("Customer Service Manager", 70000, 006),
       ("Front End Cashier", 45000, 002),
       ("Deli Cashier", 45000, 004),
       ("Courtesy Clerk", 28000, 002),
       ("Back Stocker", 35000, 003),
       ("Produce Stocker", 35000, 001),
       ("Baker", 45000, 005),
       ("Bakery Stocker", 35000, 005),
       ("Service Desk", 50000, 006);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ethan", "Cooper", 001, NULL),
       ("Olivia", "Thompson", 002, 001),
       ("Jackson", "Martinez", 003, 001),
       ("Ava", "Reed", 004, 001),
       ("Benjamin", "Ramirez", 005, 001),
       ("Emma", "Parker", 006, 001),
       ("Liam", "Collins", 007, 002),       
       ("Sophia", "Campbell", 007, 002),
       ("Mason", "Butler", 007, 002),        
       ("Isabella", "Ross", 007, 002),
       ("Lucas", "Peterson", 008, 004),        
       ("Mia", "Carter", 008, 004),
       ("William", "Brooks", 009, 002),
       ("Charlotte", "Nelson", 009, 002),        
       ("Logan", "Phillips", 009, 002),
       ("Amelia", "Powell", 011, 003),
       ("Caleb", "Garcia", 011, 003),
       ("Harper", "Wright", 010, 001),        
       ("Noah", "Foster", 010, 001),
       ("Elijah", "Sanchez", 010, 001),        
       ("Abigail", "Davis", 010, 001),
       ("Madison", "Hughes", 012, 005),        
       ("Alexander", "Flores", 012, 005),
       ("Elizabeth", "Myers", 013, 005),        
       ("Gabriel", "Richardson", 013, 005),
       ("Victoria", "Lee", 014, 006),
       ("Samuel", "Ortiz", 014, 006);
       
       