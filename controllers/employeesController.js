// initialize data object
const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { 
        this.employees = data 
    }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message': 'First & Last name are required!' })
    } else {
        data.setEmployees([...data.employees, newEmployee])
        res.status(201).json(data.employees)
    }
}

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emply => emply.id === parseInt(req.body.id))
    if (!employee) {
        return res.status(400).json({ 'message': `Employee ID: ${req.body.id} not found!` })
    } else {
        if (req.body.firstname) employee.firstname = req.body.firstname
        if (req.body.lastname) employee.lastname = req.body.lastname

        const updatedData = data.employees.map(emply => {
            if (emply.id === employee.id && (emply.firstname !== employee.firstname || emply.lastname !== employee.lastname)) {
                return {...emply, firstname: employee.firstname, lastname: employee.lastname}
            }
            return emply
        })
        data.setEmployees([...updatedData])
        res.json(data.employees)
    }

}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emply => emply.id === parseInt(req.body.id))
    if (!employee) {
        return res.status(400).json({ 'message': `Employee ID: ${req.body.id} not found!` })
    } else {
        const filteredEmply = data.employees.filter(emply => emply.id !== employee.id)
        data.setEmployees([...filteredEmply])
        res.json(data.employees)
    }
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emply => emply.id === parseInt(req.params.id))
    if (!employee) {
        return res.status(400).json({ 'message': `Employee ID: ${req.body.id} not found!` })
    } else {
        res.json(employee)
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}