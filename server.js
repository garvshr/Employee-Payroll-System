const express = require("express");
const app = express();
const fileHandler = require("./modules/fileHandler");
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const employees = await fileHandler.read();
  res.render("index", { employees });
});

app.get("/add", async (req, res) => {
  res.render("add");
});
app.post("/add", async (req, res) => {
  const { name, department, salary } = req.body;

  if (!name || !department || salary < 0) {
    return res.send("Invalid data");
  }

  const employees = await fileHandler.read();

  const newEmployee = {
    id: Date.now(),
    name,
    department,
    salary: Number(salary),
  };

  employees.push(newEmployee);

  await fileHandler.write(employees);

  res.redirect("/");
});


app.get('/delete/:id', async (req, res) => {
    const id = Number(req.params.id);

    const employees = await fileHandler.read();

    const filtered = employees.filter(emp => emp.id !== id);

    await fileHandler.write(filtered);

    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const employees = await fileHandler.read();

    const employee = employees.find(emp => emp.id === id);

    res.render('edit', { employee });
});
app.post('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, department, salary } = req.body;

    const employees = await fileHandler.read();

    const updated = employees.map(emp => {
        if (emp.id === id) {
            return {
                ...emp,
                name,
                department,
                salary: Number(salary)
            };
        }
        return emp;
    });

    await fileHandler.write(updated);

    res.redirect('/');
});


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});