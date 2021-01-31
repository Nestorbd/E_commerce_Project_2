const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name,
    lastName: req.body.lastName,
    id_address: req.body.id_address
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {

  const user = req.body.username;
  const pwd = req.body.password;

  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  User.findOne({
    where: {
      username: user
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        pwd,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          id_address: user.id_address,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.findOne = (req, res) => {
  let id = req.params.id;
  User.findByPk(id)
    .then(data => {
      if (!data) {
        res.status(400).send({
          message:
            "No User found with that id"
        })
      }
      
      res.send(data);
      return;
    })
    .catch(err => {
      console.log(err.message);
      console.log("hola");
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving User with id"
      });
      return;
    });
};

exports.findOneByUserName = (req, res) => {
  const username = req.params.username;

  User.findOne({ where: { username: username } }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with username=" + username
      });
    });
}

exports.compareUserNameWithOtherUsers = (req, res) => {
  const username = req.params.username;
  const id = req.params.id;

  User.findOne({ where: { username: username, id:{[Op.ne]:[id] }} }
  )
    .then(data => {
      if (data) {
        res.send(true)
      }
      else {
        res.send(false)
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with username=" + username
      });
    });
}

exports.compareEmailWithOtherUsers = (req, res) => {
  const email = req.params.email;
  const id = req.params.id;

  User.findOne({ where: { email: email, id:{[Op.ne]:[id] }} }
  )
    .then(data => {
      if (data) {
        res.send(true)
      }
      else {
        res.send(false)
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with username=" + username
      });
    });
}

exports.compareUsersEmail = (req, res) => {
  const email = req.params.email;

  User.findOne({ where: { email: email } })
    .then(data => {
      if (data) {
        res.send(true)
      }
      else {
        res.send(false)
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with email=" + email
      });
    });

}

exports.compareUserName = (req, res) => {
  const username = req.params.username;

  User.findOne({ where: { username: username } })
    .then(data => {
      if (data) {
        res.send(true)
      }
      else {
        res.send(false)
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with username=" + username
      });
    });

}

exports.update = (req, res) => {
  const id = req.params.id;

  let user = {
    username: req.body.username,
    email: req.body.email,
   // password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name,
    lastName: req.body.lastName,
   // id_address: req.body.id_address
  }

  User.update(user, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {

        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });

};
