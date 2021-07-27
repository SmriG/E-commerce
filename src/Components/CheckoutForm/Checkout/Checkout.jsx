import React,{ useState, useEffect } from 'react';
import { Paper, Stepper, Step, Typography, StepLabel, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'
import useStyles from './styles';
import {commerce} from '../../../lib/commerce';
import {Link, useHistory} from 'react-router-dom';

import PaymentForm from '../PaymentForm';
import AddressForm from '../AddressForm';

const steps = ["Shipping Address", "Payment Details"]

const Checkout = ({cart,handleCaptureCheckout, order, error}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const history = useHistory();
    const [isfinished, setIsfinished] = useState(false);

    const classes = useStyles();

    useEffect(()=>{
        const generateToken = async ()=>{
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type:'cart'});
                
                setCheckoutToken(token)

            } catch (error) {
                history.pushState('/');
            }
        }
        generateToken();
    },[cart]);

    const nextStep= ()=> setActiveStep((prevActiveStep)=>prevActiveStep+1)
    const backStep= ()=> setActiveStep((prevActiveStep)=>prevActiveStep-1)
    
    const next = (data)=>{
        setShippingData(data)
        nextStep()
    }

    const timeout = ()=>{
        setTimeout(()=>{
            setIsfinished(true)
        },3000)
    }

    let Confirmation=()=>order.customer?(
        <>
        <div>
           <Typography variant="h5" >Thank You for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography> 
           <Divider className={classes.divider} />
           <Typography variant="subtitle2" >Order Ref: {order.customer_reference}</Typography>
           <br/>
           <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
        </div>
        </>
    ):isfinished ? (
        <>
        <div>
           <Typography variant="h5" >Thank You for your purchase.</Typography> 
           <Divider className={classes.divider} />
           <br/>
           <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
        </div>
        </>
    ) : (
        <div className={classes.spinner} >
            <CircularProgress/>
        </div>
    );

    if (error){
        <>
            <Typography variant="h5" >Error: {error}</Typography>
        </>
    }

    const Form=()=>activeStep===0? <AddressForm checkoutToken={checkoutToken} next={next} />: <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} handleCaptureCheckout={handleCaptureCheckout} timeout={timeout} />

    return (
        <>
            <CssBaseline/>
            <div className={classes.toolbar} />
            <main className={classes.layout} >
                <Paper className={classes.paper} >
                    <Typography variant="h4" align='center' >Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper} >
                        {steps.map((step)=>(
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep===steps.length?<Confirmation/>:checkoutToken && <Form/>}
                </Paper>
            </main>
        </>
    )
}

export default Checkout
