import React,{useState, useEffect} from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from "@material-ui/core";
import { useForm, FormProvider } from 'react-hook-form';
import {Link} from 'react-router-dom';
import {commerce} from '../../lib/commerce';

import FormInput from './CustomTextField';

const AddressForm = ({ checkoutToken, next }) => {
    const methods = useForm();
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSudivision, setShippingSudivision] = useState('')
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    const countries = Object.entries(shippingCountries).map(([code,label])=>({id:code, name:label}));
    const subdivisions = Object.entries(shippingSubdivisions).map(([code,label])=>({id:code, name:label}));
    const options = shippingOptions.map((so)=>({id:so.id, label:`${so.description} - (${so.price.formatted_with_symbol})`}))

    const fetchShippingCountries = async (checkoutTokenID)=>{
        const {countries}  = await commerce.services.localeListShippingCountries(checkoutTokenID);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }

    const fetchSubdivisions = async (countryCode)=>{
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);
        setShippingSubdivisions(subdivisions);
        setShippingSudivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenID, country, region)=>{
        const options = await commerce.checkout.getShippingOptions(checkoutTokenID, {country, region});
        setShippingOptions(options);
        setShippingOption(options[0]);

    }

    useEffect(()=>{
        fetchShippingCountries(checkoutToken.id)
    },[])

    useEffect(()=>{
        if (shippingCountry) fetchSubdivisions(shippingCountry);
    },[shippingCountry])
    useEffect(()=>{
        if(shippingSudivision) fetchShippingOptions(checkoutToken.id, shippingCountry,shippingSudivision)
    },[shippingSudivision])

    return (
        <>
            <Typography variant="h6" gutterBottom >Shipping Address</Typography>
            <FormProvider {...methods} >
                <form onSubmit={methods.handleSubmit((data)=>next({ ...data, shippingCountry, shippingSudivision, shippingOption }))} >
                    <Grid container  spacing={3}>
                        <FormInput name='firstName' label='First Name' />
                        <FormInput name='lastName' label='Last Name' />
                        <FormInput name='address1' label='Address' />
                        <FormInput name='email' label='Email' />
                        <FormInput name='city' label='City' />
                        <FormInput name='zip' label='ZIP/ Postal Code' />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e)=> setShippingCountry(e.target.value)} >
                                {countries.map((country)=>(
                                    <MenuItem key={country.id} value={country.id} >
                                        {country.name}
                                    </MenuItem>  
                                ))}
                                
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSudivision} fullWidth onChange={(e)=> setShippingSudivision(e.target.value)} >
                                {subdivisions.map((subdivision)=>(
                                    <MenuItem key={subdivision.id} value={subdivision.id} >
                                        {subdivision.name}
                                    </MenuItem>  
                                ))}   
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Option</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e)=> setShippingOption(e.target.value)} >
                                {options.map((option)=>(
                                    <MenuItem key={option.id} value={option.id} >
                                        {option.label}
                                    </MenuItem>    
                                ))}
                                
                            </Select>
                        </Grid>

                    </Grid>
                    <br></br>
                    <div style={{display:'flex', justifyContent:'space-between'}} >
                        <Button component={Link} to="/cart" variant="outlined" color='secondary'>Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary" >Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
