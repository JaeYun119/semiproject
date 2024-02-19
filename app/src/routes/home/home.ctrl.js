
const output = { 
    home : (req,res) => {
    res.render('home/index');
    },
    login : (req,res) => {
    res.render('home/login');
    },
};

const users = {
    id: ["권재윤","김만나","임승범"],
    password: ["1234","123","12"],
};

const process = {
    login: (req,res) => {
        const id = req.body.id,
        password = req.body.password;

        console.log(id,password);
    }
};

module.exports = {
    output,
    process,
}