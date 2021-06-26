import React, { useState } from 'react'
import {Avatar, Button, Paper, Grid, Typography, Container} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { GoogleLogin } from 'react-google-login'
import {useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'

import {signin, signup} from '../../actions/auth'
import {AUTH} from '../../constants/actionTypes'
import useStyles from './styles'
import Input from './Input'
import Icon from './icon'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''} 

const SignUp = () => {
    const classes = useStyles()
    const [showPassword, setShowPassword] = useState(false)
    const [isSignedUp, setIsSignedUp] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isSignedUp) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }
    }

    const handleShowPassword = () => setShowPassword(!showPassword)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value})
    }

    const switchMode = () => {
        setFormData(initialState)
        setIsSignedUp((prevSignedUp) => !prevSignedUp)
        setShowPassword(false)
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj // cannot get property profileObj of undefined
        const token = res?.tokenId

        try {
            dispatch({type: AUTH, data: {result, token}})
            history.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    const googleFailure = (error) => {
        alert("Google Sign In Failed. Try Again Later")
    }

    return (
        <Container component = "main" maxwidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component = "h1" variant="h5">{isSignedUp ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing = {2}>
                        {
                            isSignedUp && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword = {handleShowPassword}/>
                        {isSignedUp && <Input name="confirmPassword" label = "Repeat Password" handleChange={handleChange} type="password"/>}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignedUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin 
                        clientId="480560085747-i417dd34nigh041v3sa22mar4jjmbdt5.apps.googleusercontent.com" 
                        render={(renderProps) => (<Button 
                            className={classes.googleButton} 
                            color='primary' 
                            fullWidth 
                            onClick={renderProps.onClick} 
                            disabled={renderProps.disabled} 
                            startIcon={<Icon />} 
                            variant="contained"
                        >Google Sign In</Button>
                    )}
                        onSuccess = {googleSuccess}
                        onFailure = {googleFailure}
                        cookiePolicy = "single_host_origin"
                    />             
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignedUp ? 'Do you have an account? Sign In Now!' : 'Not having account yet? Make one Now!'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default SignUp