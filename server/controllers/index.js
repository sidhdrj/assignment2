let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
/*create the userModel instance*/

let UserModel = require('../models/user');
let User = UserModel.User;

module.exports.displayHomePage = (req, res, next) => {
    if(req.user){
    res.render('home', { title: 'Home',displayName:req.user?req.user.displayName:'' });
}else{
    res.redirect('/login');
}
}
module.exports.displayAboutPage = (req, res, next) => {
    if(req.user){
    res.render('about', { title: 'About' ,displayName:req.user?req.user.displayName:''});
}else{
    res.redirect('/login');
}
}

module.exports.displayProjectsPage = (req, res, next) => {
    if(req.user){
    res.render('projects', { title: 'Projects', displayName:req.user?req.user.displayName:'' });
}else{
    res.redirect('/login');
}
}

module.exports.displayServicesPage = (req, res, next) => {
    if(req.user){
    res.render('services', { title: 'Services',displayName:req.user?req.user.displayName:'' });
}else{
    res.redirect('/login');
}
}

module.exports.displayContactPage = (req, res, next) => {
    if(req.user){
    res.render('contact', { title: 'Contact',displayName:req.user?req.user.displayName:'' });
}else{
    res.redirect('/login');
}
}



module.exports.displayBusUsersPage = (req, res, next) => {
    if(req.user){
    User.find((err, busUsers) => {
        console.log(req.user);
            res.render('businessUsers/list', { title: 'Business Users', BusUsers: busUsers,displayName:req.user?req.user.displayName:'' });
        
    });
}else{
    res.redirect('/login');
}
}

module.exports.displayBusUserEditPage = (req, res, next) => {
    if(req.user){
        let id = req.params.id;
        User.findById(id, (err, busUser) => {
        console.log(req.user);
            res.render('businessUsers/edit', { title: 'Edit Users', user: busUser,displayName:req.user?req.user.displayName:'' });
        
    });
}else{
    res.redirect('/login');
}
}

module.exports.processEditPage = (req, res, next) => {
    let id = req.params.id
    let updatedUser = User({
        "_id": id,
        "username": req.body.username,
        "email": req.body.email,
        "displayName": req.body.displayName
        
    });
    console.log('req.body.username' , req.body)
    User.updateOne({ _id: id }, updatedUser, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            //console.log(bookList);
            res.redirect('/busUsers');
        }
    });
}

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;
    User.remove({ _id: id }, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/busUsers');
        }
    });
}

module.exports.displayLoginPage = (req, res, next) => {
    //check if the user is already logged in*/
    if (!req.user)
    {
        res.render('auth/login', {
            title: "Login",
            messages: req.flash('loginMessage'),
            displayName:req.user?req.user.displayName:''
            
        })
    }
    else
    {
        return res.redirect('/');
        }
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', (err, User, info) => {
        //server err?
        if (err) {
            return next(err);
        }
        //is there a user login error?
        if (!User) {
            req.flash('loginMessage',
                'Authentication Error');
            return res.redirect('/login');
        }
        req.login(User, (err) => {
            //server error?
            if (err) {
                return next(err);
            }
            return res.redirect('/busUsers');
        });
    })(req, res, next);
}

module.exports.displayRegisterPage = (req, res, next) => {
    //check if the user is not already logged in*/
    if (!req.user)
    {
        res.render('auth/register',
            {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
    }
    else
    {
        return res.redirect('/');
        }
}
module.exports.processRegisterPage = (req, res, next) => {
    //instantiate a user object*/
    let newUser = new User({
        username: req.body.username,
        //password:req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
    });
    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.log("Error:inserting New User");
            if (err.name == "UserExits Error") {
                req.flash('registerMessage',
                    'Registration Error: User Already Exists!');
                console.log('Error: user Already Exists')
            }
            
            return res.render('auth/register',
                {
                    title: 'Register',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ''
                });
        }
        else {
            //if no error exists, then registration is successful
            //redirect the user and authenticate them
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/bookList')
            });
        }
            
    });
}
module.exports.performLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}