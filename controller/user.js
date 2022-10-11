const jwt = require('jsonwebtoken')
require('dotenv').config()
const userHelpers = require('../services/user')
const userService = require('../services/user')
const serverSID = 'VA52750fc5dd9f2520923e53adab2fbdfc'
const accountSID = 'AC15e52716cb86ba690e0d956b1082615e'
const authtoken = 'b896e74fa2d798c60845ee168d8bacc1'
const client = require('twilio')(accountSID, authtoken)


module.exports = {
    loginOtp: async (req, res) => {
        try {
            let number = await userService.finduserwithOtp(req.body.number)
            // console.log(number);
            if (number) {
                client.verify
                    .services(serverSID)
                    .verifications.create({
                        to: `+91${req.body.number}`,
                        channel: 'sms'
                    })
                res.render('user/checkOtp', { number: req.body.number, otperror: '' })
            } else {
                res.render('user/otppage', { number: 'Enter valid Number' });
            }
        } catch (err) {
            console.log(err)
        }

    },
    loginotpcheck: (req, res) => {
        try {
            console.log("im here");
            console.log(req.body);
            const { otp, number } = req.body
            client.verify.services(serverSID).verificationChecks.create({ to: `+91${number}`, code: `${otp}` }).then((resp) => {
                if (!resp.valid) {
                    res.render('user/checkOtp', { otperror: 'Enter valid OTP' })
                } else {
                    console.log('here baby');
                    userService.finduserwithOtp(req.body.number).then((userdata) => {
                        const token = jwt.sign({ userdata }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
                        res.cookie('token', token, {
                            httpOnly: true,
                        })
                        res.redirect('/')
                    })
                }

            })
        } catch (err) {
            console.log(err + "hoi this is error")
        }
    },
    signup: (req, res) => {
        try {
            let { body } = req
            userHelpers.signUp(body).then((data) => {
                if (data == 'email found') {
                    res.render('user/signup', { eamilNotFound: 'Email already exists', referalError: '' })
                } else if (data == 'invalid referal') {
                    res.render('user/signup', { referalError: 'please check the referral', eamilNotFound: '' })
                } else {
                    res.redirect('/login')
                }
            })
        } catch (error) {
            console.log(error);
            res.redirect('/error')
        }

    },
    login: (req, res) => {
        try {
            let { email } = req.body
            userHelpers.loginValidate(req.body).then((data) => {
                if (data.status == true) {
                    //the important part
                    userHelpers.findUser(req.body.email).then((userdata) => {
                        const token = jwt.sign({ userdata }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
                        res.cookie('token', token, {
                            httpOnly: true,
                        })
                        res.redirect('/')
                    })
                } else if (data == "blocked") {
                    res.clearCookie('token');
                    res.render('user/login', { passwordError: "You are Blocked", nameval: email, eamilError: '' })
                } else if (data.status == false) {
                    res.render('user/login', { passwordError: "Enter valid password", nameval: email, eamilError: '' })
                } else if (data) {
                    res.render('user/login', { eamilError: 'Enter valid Email', passwordError: '', nameval: '' })
                }
            })
        } catch (error) {
            res.redirect('/error')
            console.log(error);
            throw new Error(' Authentication failed')

        }

    }
}